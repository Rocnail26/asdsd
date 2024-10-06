import { prisma } from "../../db/prisma";
import { GetAllAccounts } from "../../types/Account";



export const getAllAccounts = async(data:GetAllAccounts) => {
        try {
            const accounts = await prisma.account.findMany({
                where:{
                    ...data
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
            return accounts
        } catch (error) {
            throw error
        }
}