import { initialData } from "./seed"
import prisma from '../lib/prisma';
import { countries } from "./seed-country";

async function main() {
    
    // 1. Borrar registros previos

    await prisma.orderAddress.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const { products, categories, users } = initialData;

    // Insertar usuarios
    await prisma.user.createMany({ data: users })

    // Insertar países
    await prisma.country.createMany({ data: countries })

    // Category
    const categoriesData = categories.map(category => ({
        name: category
    }))

    await prisma.category.createMany({
        data: categoriesData
    })

    const categoriesDB = await prisma.category.findMany();

    const categoriesMap = categoriesDB.reduce( (map, category) => {

        map[category.name.toLowerCase()] = category.id

        return map
    }, {} as Record<string, string>) // <string=shirt, string=categoryId>

    // Products
    products.forEach( async(product) => {

        const { images, type, ...rest } = product

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        })

        // Images

        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }))

        await prisma.productImage.createMany({
            data: imagesData
        })
    })

    console.log('Seed ejecutado correctamente');
}



(() => {

    if(process.env.NODE_ENV === 'production') return;

    main();

})()