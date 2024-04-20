'use server';

import prisma from '@/lib/prisma'
import { Gender } from '@prisma/client';

interface PaginationProps{
    page?: number
    gender?: Gender
    take?: number
}


export const getPaginatedProductsWithImages = async({ page = 1, gender, take = 12 }: PaginationProps) => {

    if( isNaN( Number(page) ) ) page = 1;
    if( page < 1 ) page = 1;

    try {

        // 1. Obtener productos
        const products = await prisma.product.findMany({
            take: take,
            skip: ( page - 1 ) * take,
            include: {
                productImage: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            },
            // Por género
            where: {
                gender: gender
            }
        })

        // 2. Obtener total de paginas
        const countOfProducts = await prisma.product.count({ where: { gender: gender } })
        const totalPages = Math.ceil( countOfProducts / take )

        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.productImage.map(image => image.url)
            }))
        }

    } catch (error) {
        throw new Error('No se pudo cargar los productos')
    }
}