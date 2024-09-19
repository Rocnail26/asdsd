import { prisma } from "../../db/prisma"
import { GetAllPayment } from "../../types/Payment"


export const getAllPayment = async (data:GetAllPayment) => {
    try {
        const {community_id} = data
        const payments = await prisma.payment.findMany({
            where:{
                Account:{
                    community_id
                }
            }
        })

        return payments
    } catch (error) {
        throw error
    }
}

