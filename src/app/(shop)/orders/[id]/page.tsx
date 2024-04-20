import Image from "next/image";
import clsx from "clsx";
import { IoCartOutline } from "react-icons/io5";

import { PayPalButton, PaymentStatus, Title } from "@/components";
import { getOrderById } from "@/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { currencyFormat } from '@/utils';

interface Props{
  params: {
    id: string
  }
}

export default async function OrderIDPage({ params }: Props){

  const { id } = params;

  const { ok, order } = await getOrderById(id);
  const address = order?.OrderAddress;
  
  if(!ok){
    redirect('/')
  }


  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      
      <div className='flex flex-col w-[1000px]'>
        
        <Title title={`Orden #${ id.split('-')[0] }`}/>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>

          {/* Carrito */}
          <div className='flex flex-col mt-5'>

            <PaymentStatus isPaid={ order!.isPaid }/>

            {
              order!.OrderItem.map(item => (
                <div key={ item.product.slug + '-' + item.size} className='flex mb-8'>
                  
                  <Image 
                    src={`/products/${ item.product.productImage[0].url }`} 
                    alt={ item.product.title }
                    width={ 100 }
                    height={ 100 }
                    className='rounded mr-5'
                  />

                  <div>
                    <p>{ item.product.title }</p>
                    <p className='mb-1'>${ item.price } x { item.quantity }</p>
                    <p className='mb-1 font-semibold'>Subtotal: { currencyFormat(item.price * item.quantity) }</p>
                  </div>

                </div>
              ))
            }

          </div>


          {/* Checkout */}
          <div className='bg-white shadow-xl rounded-xl p-7 h-min'>

            <div className='flex flex-col'>

              <h2 className='text-xl font-bold'>Dirección de entrega</h2>

              <div className='mt-2'>

                <p>{ address!.firstName } { address!.lastName }</p>
                <p>{ address!.address }</p>
                <p>{ address!.address2 }</p>
                <p>{ address!.city }</p>
                <p>CP: { address!.postalCode }</p>
                <p>Tel: { address!.phone }</p>

              </div>

            </div>

            <div className='w-full h-0.5 rounded bg-gray-200 my-6'/>

            <div className='flex flex-col'>

              <h2 className='text-xl font-bold'>Resumen de orden</h2>

              <div className='grid grid-cols-2 mt-2'>

                <span>Nro. Productos</span>
                <span className='text-right'>{ order!.itemsInOrder } artículos</span>
                
                <span>Subtotal</span>
                <span className='text-right'>{ currencyFormat(order!.subTotal) }</span>
                
                <span>Impuestos (15%)</span>
                <span className='text-right'>{ currencyFormat(order!.tax) }</span>

                <span className='text-2xl mt-5'>Total:</span>
                <span className='text-2xl text-right mt-5'>{ currencyFormat(order!.total) }</span>
                
              </div>

              <div className='mt-5 w-full'>
                {
                  order!.isPaid
                  ? (
                    <PaymentStatus isPaid={ order!.isPaid }/>
                    )
                    : (
                    <PayPalButton orderId={ order!.id } amount={ order!.total } />
                  )
                }
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}