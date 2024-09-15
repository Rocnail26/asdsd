import { prisma } from "../../db/prisma";
import { GetProvider } from "../../types/Provider";



export const getProvider = async (data:GetProvider) => {
    try {
        const provider = await prisma.provider.findUnique({
            where:{
                ...data
            },
            include:{
                Cashout:true,
                Community:true
            },
            omit:{
                community_id:true
            }
        })
        return provider
    } catch (error) {
        throw error        
    }
}