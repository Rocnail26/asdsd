import { prisma } from "../../db/prisma";
import { GetAccount } from "../../types/Account";


export const getAccount = async (data:GetAccount) => {
    try {
        const account = prisma.account.findUnique({
            where: {
                ...data
            }
        })
        return account
    } catch (error) {
        throw error
    }
}