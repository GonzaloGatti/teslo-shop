'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";

import { placeOrder } from "@/actions";
import { useAddressStore } from "@/store/address/address-store";
import { useCartStore } from "@/store/cart/cart.store";
import { currencyFormat } from "@/utils";



export const PlaceOrder = () => {

    const router = useRouter()

    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const address = useAddressStore(state => state.address);
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation());
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);


    
    useEffect(() => {
        setLoaded(true);
    }, [])

    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))


        // Server Action
        const resp = await placeOrder(productsToOrder, address)
        if(!resp.ok){
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        //* Todo salio bien  
        clearCart();
        router.replace('/orders/' + resp.order?.id);
    }


    if(!loaded){
        return (<h3 className="5xl">Loading...</h3>)
    }


    return (
        <div className='bg-white shadow-xl rounded-xl p-7 h-min'>

            <div className='flex flex-col'>

                <h2 className='text-xl font-bold'>Dirección de entrega</h2>

                <div className='mt-2'>

                    <p className="text-xl">{ address.firstName } { address.lastName }</p>
                    <p>{ address.address }</p>
                    <p>{ address.address2 }</p>
                    <p>{ address.postalCode }</p>
                    <p>{ address.city }, { address.country }</p>
                    <p>{ address.phone }</p>
            
                </div>

            </div>

            <div className='w-full h-0.5 rounded bg-gray-200 my-6'/>

            <div className='flex flex-col'>

                <h2 className='text-xl font-bold'>Resumen de orden</h2>

                <div className='grid grid-cols-2 mt-2'>

                    <span>Nro. Productos</span>
                    <span className="text-right">
                        {
                            loaded ? `${ itemsInCart } artículos` : 'Calculando...'
                        }
                    </span>
                    
                    <span>Subtotal</span>
                    <span className="text-right">{ (loaded) ? currencyFormat(subTotal)  : 'Calculando...' }</span>

                    <span>Impuestos (15%)</span>
                    <span className="text-right">{ (loaded) ? currencyFormat(tax) : 'Calculando...' }</span>

                    <span className="text-2xl mt-5">Total:</span>
                    <span className="text-2xl text-right mt-5">{ (loaded) ? currencyFormat(total) : 'Calculando...' }</span>
                    
                </div>

                <div className='mt-5 mb-2 w-full'>
                    <p className='mb-5'>
                        <span className='text-xs'>
                            Al hacer click en Colocar orden, aceptas nuestros <a href='#' className='underline'>términos y condiciones</a> y <a href='#' className='underline'>política de privacidad</a>
                        </span>
                    </p>

                    <p className="text-red-500">{ errorMessage }</p>

                    <button 
                        onClick={ onPlaceOrder }
                        className={
                            clsx(
                                {
                                    'btn-primary': !isPlacingOrder,
                                    'btn-disabled': isPlacingOrder
                                }
                            )
                        }
                    >
                    Colocar orden
                    </button>
                </div>

            </div>

        </div>
  )
}
