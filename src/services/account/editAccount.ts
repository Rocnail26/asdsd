import { prisma } from "../../db/prisma";
import { ediAccount } from "../../types/Account";



export const editAccount = async (data:ediAccount) => {
    try {
        const {community_id,id,...restData} = data
        const existAccount = prisma.account.findUnique({
            where:{
                community_id,
                id
            }
        })
        if(!existAccount) return null

        const account = prisma.account.update({
            where:{
                id,
                community_id
            },
            data:{
                ...restData
            }
        })

        return account
    } catch (error) {
        throw error
    }
}