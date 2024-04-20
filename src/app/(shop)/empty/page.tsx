import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function EmptyPage() {
  return (
    <div className='flex justify-center items-center h-[800px]'>

      <IoCartOutline size={ 80 }/>

      <div className='flex flex-col mx-2 items-center'>

        <h1 className='text-xl font-semibold'>
          Carrito vacio
        </h1>

        <Link 
          href={ '/' } 
          className='text-blue-500 text-2xl mt-2'
        >
          Regresar
        </Link>

      </div>

    </div>
  );
}