'use client'

import { ProductImage } from "@/components"
import { Product } from "@/interfaces"
import Link from "next/link"
import { useState } from "react"

interface Props{
    product: Product
}

export const ProductGridItem = ({ product }: Props) => {

    const [displayImage, setDisplayImage] = useState( product.images[0] )

  return (
    <div className='rounded-md overflow-hidden fade-in'>
        <Link 
            href={`/product/${ product.slug }`} 
            onMouseEnter={() => setDisplayImage(product.images[1])}
            onMouseLeave={() => setDisplayImage(product.images[0])}
        >
            <ProductImage 
                src={ displayImage } 
                alt={ product.title }
                className='w-full object-cover rounded'
                width={ 450 }
                height={ 450 }
            />
        </Link>

        <div className='flex flex-col p-4'>
            <Link href={`/product/${ product.slug }`} className='hover:text-sky-600'>{ product.title }</Link>
            <span className='font-bold'>${ product.price }</span>
        </div>
    </div>
  )
}
