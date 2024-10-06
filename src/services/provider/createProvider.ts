import { prisma } from "../../db/prisma";
import { NewProvider } from "../../types/Provider";




export const createProvider = async (data: NewProvider) => {
    try {
        const provider = await prisma.provider.create({
            data
        })
        return provider
    } catch (error) {
        throw error        
    }
}