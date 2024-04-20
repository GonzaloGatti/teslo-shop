'use client';

import { ProductImage, QuantitySelector } from '@/components'
import { useCartStore } from '@/store/cart/cart.store';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const cart = useCartStore(state => state.cart)
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
    const removeProductToCart = useCartStore(state => state.removeProductToCart)

    useEffect(() => {
        setLoaded(true)
    }, [])

    if(!loaded){
        return <p>Loading...</p>
    }

    return (
        <>
            {
                cart.map(product => (
                <div 
                    key={ `${ product.slug }-${ product.size }` } 
                    className='flex mb-8'
                >
                    
                    <ProductImage 
                    src={ product.image } 
                    alt={ product.title }
                    width={ 100 }
                    height={ 100 }
                    className='rounded mr-5'
                    />

                    <div>
                        <Link
                            href={`/product/${ product.slug }`}
                            className='hover:underline cursor-pointer'
                        >
                            <p>{ product.size } - { product.title }</p>
                        </Link>
                        <p className='mb-1'>${ product.price }</p>
                        <QuantitySelector quantity={ product.quantity } onChangeQuantity={ quantity => updateProductQuantity(product, quantity) }/>
                        <button 
                            onClick={ () => removeProductToCart(product) }
                            className='underline mt-3'
                        >
                            Remover
                        </button>
                    </div>

                </div>
                ))
            }
        </>
    )
}
