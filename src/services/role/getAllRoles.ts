import { prisma } from "../../db/prisma"


export const getAllRoles = async() => {
    try {
        const roles = await prisma.role.findMany()
        return roles
    } catch (error) {
        throw error        
    }
}