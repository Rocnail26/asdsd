import { prisma } from "../../db/prisma";
import { NewPayment } from "../../types/Payment";
import { editExpense } from "../Expense";


export const createPayment = async(data: NewPayment) => {
    try {

        const {expenses,...rest} = data
    
        if(data.status == "Pending" && expenses?.some(expense =>  expense.owedValue)) throw new Error("estas tratando de cancelar una expensa con un pago pendiente")

        const payment = await prisma.payment.create({
             data:{
                ...rest,
                Expense: {
                    connect : expenses && data.status == "Pending" ? expenses : undefined
                }
             }
        })
        if(payment.status == "Paid"){
          await  prisma.account.update({
                where: {
                    id: data.account_id
                },
                data:{
                    balance: {
                        increment: data.amount
                    }
                }
            })
        }

        if (expenses && expenses.length > 0 && payment.status == "Paid") {
            
            await Promise.all(expenses.map(expense => 
                editExpense({...expense,payment_id:payment.id})
            ));
 
          }

 

        return payment
    } catch (error) {
        throw error
    }
}



