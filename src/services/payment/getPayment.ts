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
        },
        include:{
            Expense: {
                orderBy:{
                    createdAt:"desc"
                },
                include:{
                    Residence:{
                        select: {
                            title:true,
                            id:true
                        }
                    }
                }
                
            },
            Account: true,
            Admin:true,
        },
        omit:{
            account_id:true,
            created_by:true,
        }
       })

       return payment
    } catch (error) {
        throw error
    }
}