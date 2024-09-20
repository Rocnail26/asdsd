import { prisma } from "../../db/prisma";
import { GetCashout } from "../../types/Cashout";





export const getCashout = async (data: GetCashout) => {
    try {
        const {community_id,id} = data
        const cashout = await prisma.cashout.findUnique({
            where:{
                id,
                Account:{
                    community_id
                }
            }
        })
        return cashout
    } catch (error) {
        throw error        
    }
}