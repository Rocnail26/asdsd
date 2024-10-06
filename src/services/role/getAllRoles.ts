import { prisma } from "../../db/prisma"


export const getAllRoles = async() => {
    try {
        const roles = await prisma.role.findMany({
            where:{
                id:{
                    not: 1
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return roles
    } catch (error) {
        throw error        
    }
}