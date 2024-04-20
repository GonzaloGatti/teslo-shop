'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma'

export const getOrderById = async(id: string) => {

    const session = await auth()

    if(!session) {
        return {
            ok: false,
            message: 'El usuario debe estar auntenticado'
        }
    }

    try {
        
        const order = await prisma.order.findFirst({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        size: true,
                        quantity: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                productImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!order) throw `${ id } no existe`;

        if(session.user.role === 'user'){
            if(session.user.id !== order.userId){
                throw `${ id } no es de este usuario`
            }
        }


        return {
            ok: true, 
            order: order
        }
        

    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'Hable con el administrador'
        }
    }
}
