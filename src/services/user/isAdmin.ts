import { prisma } from "../../db/prisma"

export const isAdmin = async(id:string):Promise<Boolean> => { 
    try {
        const user = await prisma.user.findUnique({
            where:{
                id
            },
            include:{
                Role:true,
            }
        })
     return user?.Role?.title == "admin" ? true : false
    } catch (error) {
        throw error
    }
}