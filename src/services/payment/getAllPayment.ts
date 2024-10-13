import { prisma } from "../../db/prisma"
import { ResidenceTypeScalarFieldEnumSchema } from "../../db/zod"
import { GetAllPayment } from "../../types/Payment"


export const getAllPayment = async (data:GetAllPayment) => {
    try {
        const {community_id} = data
        const payments = await prisma.payment.findMany({
            where:{
                Account:{
                    community_id
                }
            },
            include:{
                Expense:{
                    select:{
                        owedValue:true,
                        title:true,
                        value:true,
                        Residence:{
                            select:{
                                title:true,
                                id:true
                            }
                        }
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                },
                Account:{
                    select:{
                        accountNumber:true,
                        title:true
                    }
                },
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        return payments
    } catch (error) {
        throw error
    }
}

