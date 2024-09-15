import { Request } from "express";
import { GetAllProviders } from "../../types/Provider";
import { prisma } from "../../db/prisma";



export const getAllProviders = async(data: GetAllProviders) => {
    try {
        const providers = prisma.provider.findMany({
            where:{
                ...data
            },
        })

        return providers
    } catch (error) {
        throw error
    }
} 