'use client';

import { useCartStore } from "@/store/cart/cart.store";
import { currencyFormat } from "@/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false)
    const cart = useCartStore(state => state.cart)
    const totalItemsInCart = useCartStore(state => state.getProductsInCart());

    const subtotal = cart.reduce((total, item) => {
        return total + (item.quantity * item.price)
    }, 0)
    const impuestos = subtotal * 0.15
    
    useEffect(()=> {
        setLoaded(true);
    }, [])

    return (
        <div className="flex flex-col">
        <h2 className="text-lg font-semibold">Resumen de orden</h2>

        <div className="grid grid-cols-2 mt-3">
            <span>Nro. Productos</span>
            <span className="text-right">
                {
                    loaded ? `${ totalItemsInCart } artículos` : 'Calculando...'
                }
            </span>
            
            <span>Subtotal</span>
            <span className="text-right">{ (loaded) ? currencyFormat(subtotal)  : 'Calculando...' }</span>

            <span>Impuestos (15%)</span>
            <span className="text-right">{ (loaded) ? currencyFormat(impuestos) : 'Calculando...' }</span>

            <span className="text-2xl mt-5">Total:</span>
            <span className="text-2xl text-right mt-5">{ (loaded) ? currencyFormat(subtotal + impuestos) : 'Calculando...' }</span>
        </div>

        <Link
            href={"/checkout/address"}
            className="btn-primary mt-5 justify-center text-center"
        >
            Comprar
        </Link>
        </div>
    );
};
