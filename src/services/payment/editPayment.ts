import { EditPayment } from "../../types/Payment"
import { prisma } from "../../db/prisma"

export const editPayment = async (data:EditPayment) => {
    try {
        const {id,community_id,...rest} = data
        const existPayment = await prisma.payment.findUnique({
            where:{
                id,
                Account:{
                    community_id
                }
            }
        })

        if(!existPayment) throw new Error("pago no encontrado")

        const payment = await prisma.payment.update({
            where:{
                id,
            },
            data:{
                ...rest
            }
        })    
    } catch (error) {
        throw error
    }
}