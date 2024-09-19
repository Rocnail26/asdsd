import { prisma } from "../../db/prisma"
import { GetPayment } from "../../types/Payment"

export const getpayment = async (data:GetPayment) => {
    try {
       const {community_id,id} = data
       const payment = await prisma.payment.findUnique({
        where:{
            id,
            Account:{
                community_id
            }
        }
       })

       return payment
    } catch (error) {
        throw error
    }
}