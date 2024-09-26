import { EditPayment } from "../../types/Payment"
import { prisma } from "../../db/prisma"
import { Prisma } from "@prisma/client"
import { promise } from "zod"
import { editExpense } from "../Expense"

export const editPayment = async (data:EditPayment) => {
    try {
        const {id,community_id,expenses,...rest} = data
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

            if(expenses){
                await Promise.all(expenses.map((expense) => {
                    return editExpense(expense)
                } ))
            }
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

           if(expenses){
            const expenses = await prisma.expense.findMany({
                where: {
                  payment_id: payment.id
                },
                select:{
                    value:true,
                    id:true
                }
              });

              const updatePromises = expenses.map(expense => 
                prisma.expense.update({
                  where: {
                    id: expense.id
                  },
                  data: {
                    owedValue: expense.value
                  }
                })
              );
              
              await Promise.all(updatePromises);
           }


        }


        
  



        return payment
    } catch (error) {
        throw error
    }
}