import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { NewAccount } from "../../types/Account";



export const createAccount = async(data:NewAccount) => {
    try {
        const account = await prisma.account.create({
            data: {
                ...data,
                balance: new Prisma.Decimal(data.balance)
            }
        })
        return account
    } catch (error) {
        throw error
    }
}