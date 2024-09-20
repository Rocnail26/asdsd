import { prisma } from "../../db/prisma";
import { EditCashout, GetCashout } from "../../types/Cashout";



export const editCashout = async (data:EditCashout) => {
    try {
       const {community_id,id,...rest} = data
       const cashout = await prisma.cashout.findUnique({
        where:{
            id,
            Account:{
                community_id
            }
        }
       })
       if(!cashout) throw new Error("cashout no encontrado")

        const amount = data.amount || cashout.amount

       if(cashout.status == "Pending" && data.status == "Paid"){
         const account = await prisma.account.update({
            where:{
                id: cashout.account_id,
                balance:{
                    gte: amount
                }
            },
            data:{
                balance:{
                    decrement: amount
                }
            }
          })
       } 

       if(cashout.status == "Paid" && data.status == "Pending"){
        const account = await prisma.account.update({
            where:{
                id: cashout.account_id,
                balance:{
                    gte: amount
                }
            },
            data:{
                balance:{
                    increment: amount
                }
            }
          }) 
       }
       
       const updatedCashout = await prisma.cashout.update({
            where: {
                id
            },
            data:{
                ...rest
            }
        })  

        return updatedCashout
    } catch (error) {
        throw error
    }
} 