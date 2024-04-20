'use server';

import prisma from '@/lib/prisma'
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender)
})

export const createUpdateProduct = async(formData: FormData) => {

    const data = Object.fromEntries(formData);
    const parsedProduct = productSchema.safeParse(data);

    if(!parsedProduct.success){
        console.log(parsedProduct.error);
        return {
            ok: false
        }
    }

    const product = parsedProduct.data;
    product.slug = product.slug.toLowerCase().replace(/ /g, '_').trim();

    const { id, ...restProduct } = product;

    try {

        const prismaTx = await prisma?.$transaction(async (tx) => {
            
            let product: Product;
            const tagsArray = restProduct.tags.split(',').map(tag => tag.trim().toLowerCase())
    
            if(id){
                // Actualizar
    
                product = await prisma?.product.update({
                    where: { id },
                    data: {
                        ...restProduct,
                        sizes: {
                            set: restProduct.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
    
    
            } else {
                // Crear
                product = await prisma.product.create({
                    data: {
                        ...restProduct,
                        sizes: {
                            set: restProduct.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }

            // Proceso de carga y guardado de imagenes
            // Recorrer las imagenes y guardarlas
            if(formData.getAll('images')){
                // Devuelve un arreglo de URL´s
                const images = await uploadImages(formData.getAll('images') as File[]);
                if(!images){
                    throw new Error('No se pudo cargar las imagenes, rollingback');
                }

                await prisma.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id
                    }))
                })
            }
    
            
            return {
                product
            }
            
        })

        // TODO: revalidatePaths
        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${ product.slug }`)
        revalidatePath(`/products/${ product.slug }`)

        return {
            ok: true,
            product: prismaTx.product
        }
        
    } catch (error) {
        return {
            ok: false,
            message: 'Realizar los logs, no se pudo actualizar/crear'
        }
    }

}

const uploadImages = async(images: File[]) => {

    try {

        const uploadPromises = images.map( async(image) => {
        
            try {
                
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`) 
                    .then( res => res.secure_url);
  
            } catch (error) {
                console.log(error);
                return null;
            }
        })               

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;

    } catch (error) {
        console.log(error);
        return null
    }

}