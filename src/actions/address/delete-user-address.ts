'use server';

export const deleteUserAddress = async(userId: string) => {

    try {
        await prisma?.userAddress.delete({ where: { userId } })

        return {
            ok: true
        }

    } catch (error) {
        console.log(error);
        
        return {
            ok: false,
            message: 'No se pudo eliminar la dirección de la base de datos'
        }
    }
}