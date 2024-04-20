import { Title } from "@/components";
import { useCartStore } from "@/store/cart/cart.store";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";


export default function CartPage(){

  // const cart = useCartStore(state => state.cart)

  // if(cart.length === 0) redirect('/empty')

  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      
      <div className='flex flex-col w-[1000px]'>
        
        <Title title='Carrito'/>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>

          {/* Carrito */}
          <div className='flex flex-col mt-5'>

            <span className="text-xl">Agregar más items</span>
            <Link href="/" className="underline mb-5">
              Continúa comprando
            </Link>

            <ProductsInCart />

          </div>


          {/* Checkout */}
          <div className='bg-white shadow-xl rounded-xl p-7 h-min'>
            <OrderSummary />
          </div>


        </div>

      </div>

    </div>
  );
}