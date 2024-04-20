'use client';

import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5"

interface Props{
    quantity: number
    onChangeQuantity: ( quantity: number ) => void
}

export const QuantitySelector = ({ quantity, onChangeQuantity }: Props) => {

    const onChangeValue = (value: number) => {

        if( quantity + value < 1 ) return;

        onChangeQuantity( quantity + value )
    }

    return (
        <div className='flex'>
            <button
                onClick={() => onChangeValue( -1 ) }
            >
                <IoRemoveCircleOutline size={ 30 }/>
            </button>

            <span className='w-20 text-center mx-3 px-5 bg-gray-100 rounded'>
                { quantity }
            </span>

            <button
                onClick={() => onChangeValue( 1 ) }
            >
                <IoAddCircleOutline size={ 30 }/>
            </button>

        </div>
    )
}
