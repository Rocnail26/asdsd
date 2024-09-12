import { prisma } from "../../db/prisma"


export const getAllResidenceType = async(community_id:string) => {
    try {
        const residenceType = await prisma.residenceType.findMany({
            where: {
                community_id
            },
            orderBy:{
                id:"asc"
            }
        })
        return residenceType
    } catch (error) {
        throw error
    }
}