'use server';

import prisma from '@/lib/prisma'
import { PaypalOrderStatusResponse } from "@/interfaces";
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async(transactionId: string) => {

    const authToken = await getPayPalBearerToken()

    if(!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificación'
        }
    }

    const resp = await verifyPayPalPayment(transactionId, authToken);

    if(!resp) {
        return {
            ok: false,
            message: 'No se pudo verificar el pago'
        }
    }

    const { status, purchase_units } = resp;
    const { invoice_id: orderId } = purchase_units[0]; 

    if(status !== 'COMPLETED'){
        return {
            ok: false,
            message: 'Todavía no se pagó con PayPal'
        }
    }

    // TODO: realizar la actualizacion en la bd 
    try {
        
        await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })

        revalidatePath(`/orders/${ orderId }`)

        return {
            ok: true
        }

    } catch (error) {
        console.log(error);

        return {
            ok: false, 
            message: 'El pago no se pudo realizar'
        }
    }

}

// Esta funcion genera token de autenticación
const getPayPalBearerToken = async(): Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(
        `${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET }`,
        'utf-8'
    ).toString('base64')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${ base64Token }` );

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(PAYPAL_OAUTH_URL, {
            ...requestOptions,
            cache: 'no-store'
        }).then(res => res.json())
        
        return result.access_token

    } catch (error) {
        console.log(error);
        return null
    }

}

const verifyPayPalPayment = async(transactionId: string, bearerToken: string): Promise<PaypalOrderStatusResponse | null> => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ bearerToken }` );

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`

    try {
        const resp = await fetch(paypalOrderUrl, {
            ...requestOptions,
            cache: 'no-store'
        }).then(res => res.json())

        return resp;

    } catch (error) {
        console.log(error);
        return null;
    }

}