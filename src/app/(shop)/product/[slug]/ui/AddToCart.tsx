'use client';

import { QuantitySelector, SizeSelector } from '@/components'
import { CartProduct, Product, ValidSize } from '@/interfaces'
import { useCartStore } from '@/store/cart/cart.store';
import { useState } from 'react';

interface Props{
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<ValidSize | undefined>();
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)

    const addProductToCart = useCartStore(state => state.addProductToCart)

    const addToCart = () => {
        setPosted(true)

        if(!size) return;

        const productToCart: CartProduct = {
            id: product.id,
            price: product.price,
            title: product.title,
            slug: product.slug,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }

        addProductToCart(productToCart);

        setSize(undefined);
        setQuantity(1);
        setPosted(false);
    }

    return (
        <>
            {
                posted && !size && (
                    <span className='text-red-600 fade-in'>
                        Debe seleccionar un talle*
                    </span>

                )
            }

            {/* Selector de tallas */}
            <SizeSelector 
                selectedSize={ size }
                availableSizes={ product.sizes }
                onChangeSize={ setSize }
            />

            {/* Selector de cantidad */}
            <QuantitySelector 
                quantity={ quantity }
                onChangeQuantity={ setQuantity } 
            />

            {/* Button */}
            <button className='btn-primary my-5' onClick={ addToCart }>
            Agregar al carrito
            </button>
        </>
    )   
}
