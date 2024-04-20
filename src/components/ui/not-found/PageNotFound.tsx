import { titleFont } from "@/config/fonts"
import Image from "next/image"
import Link from "next/link"

export const PageNotFound = () => {
  return (
    <div className='flex flex-col-reverse md:flex-row justify-center items-center w-full h-[800px]'>
    
        <div className='text-center mx-5'>
            <h2 className={`${ titleFont.className } font-bold text-9xl`}>404</h2>
            <p className='font-semibold text-xl'>Whooops! Lo siento</p>
            <p>
                <span>Regresar al </span>
                <Link href={'/'} className='text-sky-500 hover:underline'>inicio</Link>
            </p>
        </div>

        <div className='mx-5'>
            <Image src={'/imgs/starman_750x750.png'} alt='Starman' width={550} height={550}/>
        </div>

    </div>
  )
}
