import { prisma } from "../../db/prisma";
import { GetAllCashouts } from "../../types/Cashout";



export const getAllCashouts = async(data: GetAllCashouts) => {
    try {
        const {community_id} = data
        const cashouts = await prisma.cashout.findMany({
            where:{
                Account:{
                    community_id
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return cashouts
    } catch (error) {
        throw error
    }
}