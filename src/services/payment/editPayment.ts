import { EditPayment } from "../../types/Payment"
import { prisma } from "../../db/prisma"
import { Prisma } from "@prisma/client"

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

        if(payment.status == "Paid" && existPayment.status == "Pending"){
            await prisma.account.update({
                where:{
                    id: payment.account_id
                },
                data:{
                    balance: {
                        increment: payment.amount
                    }
                }
            })
        }

        if(payment.status == "Pending" && existPayment.status == "Paid"){
            await prisma.account.update({
                where:{
                    id: payment.account_id
                },
                data:{
                    balance: {
                        decrement: payment.amount
                    }
                }
            })
        }


        
  



        return payment
    } catch (error) {
        throw error
    }
}