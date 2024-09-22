import { prisma } from "../../db/prisma";
import { EditCashout } from "../../types/Cashout";



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

       if(cashout.status == "Pending" && data.status == "Paid" && cashout.toAccount_id){
        await prisma.account.update({
            where:{
                id: cashout.account_id
            },
            data:{
                balance: {
                    decrement: cashout.amount
                }
            }
        })
        
        await prisma.account.update({
         where:{
           id: cashout.toAccount_id
         },
         data:{
           balance:{
             increment: amount
           }
         }
        })
        }

       if(cashout.status == "Paid" && data.status == "Pending" && cashout.toAccount_id) throw new Error("no pudes pasar el pago a pendiente debes hacer una nueva transferencia")
       
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