'use server';

import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import { Address } from "@/interfaces";
import { Size } from "@prisma/client";

interface ProductToOrder {
    productId: string
    quantity: number
    size: Size
}

export const placeOrder = async(productIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id;

    if( !userId ){
        return {
            ok: false,
            message: 'No existe sesión del usuario'
        }
    }

    // Obtener la info de los productos
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    // Obtener la cantidad de productos
    const itemsInOrderQ = productIds.reduce( (count, p) => count + p.quantity, 0);

    // Obtener subtotal, tax y total
    const { subTotal, tax, total } = productIds.reduce((totals, item)=> {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId)

        if( !product ) throw new Error(`${ item.productId } no existe - 500`)

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15
        totals.total += subTotal * 1.15
    
        return totals
    }, { subTotal: 0, tax: 0, total: 0 })

    // Crear la transaccion de base de datos

    try {

        const prismaTx = await prisma.$transaction( async(tx) => {

            // 1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map(product => {
    
                const productQuantity = productIds.filter(p => p.productId === product.id).reduce((acc, item) => acc + item.quantity, 0)
    
                if( productQuantity === 0) throw new Error(`${ product.id } no tiene cantidad definida`)
    
                return tx.product.update({
                    where: { id: product.id },
                    data: { inStock: { decrement: productQuantity } }
                })
            })
    
            const updatedProducts = await Promise.all(updatedProductsPromises)
    
            // Verificar si hay existencia de los productos (stock)
            updatedProducts.forEach(product => {
                if(product.inStock < 0){
                    throw new Error(`${ product.title } no tiene stock suficiente`)
                }
            })
    
            // 2. Crear la orden - Order - OrderItem
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
                    itemsInOrder: itemsInOrderQ,
    
                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })
    
            // Validar si el price es 0, si lo es, lanzar un error
    
            // 3. Crear la direccion de la orden - OrderAddress
            const { country, ...restAddress} = address
            const addressOrder = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                }
            })
    
            return {
                order: order,
                orderAddress: addressOrder,
                updatedProducts: updatedProducts
            }
        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }
        
    } catch (error: any) {
        return {
            ok: false,
            message: error.message
        }
    }

    
}