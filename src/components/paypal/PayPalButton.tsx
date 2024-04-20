'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props{
    orderId: string
    amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = Math.round(amount * 100) / 100

    if(isPending){
        return (
            <div className="animate-pulse">
                <div className="h-11 bg-slate-500 rounded"/>
                <div className="h-11 bg-slate-500 rounded mt-4"/>
            </div>
        )
    }

    const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        currency_code: 'USD',
                        value: `${ roundedAmount }`
                    }
                }
            ]
        })

        // Server action para cargar el transactionId en la orden en la BD
        const { ok } = await setTransactionId(orderId, transactionId)
        if(!ok) {
            throw new Error('No se pudo actualizar la orden')
        }

        return transactionId;
    }

    const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {

        const details = await actions.order?.capture();
        if(!details || !details.id) return;

        await paypalCheckPayment(details.id)
    }

    return (
        <div className="relative z-0">
            <PayPalButtons 
                createOrder={ createOrder }
                onApprove={ onApprove }
            />
        </div>
    )
}
