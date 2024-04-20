'use client';

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { useCartStore } from '@/store/cart/cart.store';
import { currencyFormat } from '@/utils';

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const cart = useCartStore(state => state.cart)

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
                    
                    <Image 
                    src={`/products/${ product.image }`} 
                    alt={ product.title }
                    width={ 100 }
                    height={ 100 }
                    className='rounded mr-5'
                    />

                    <div>
                        <span>
                            <p>{ product.size } - { product.title } ({ product.quantity })</p>
                        </span>
                        <p className='mb-1 font-bold'>{ currencyFormat(product.price * product.quantity) }</p>
                    </div>

                </div>
                ))
            }
        </>
    )
}
