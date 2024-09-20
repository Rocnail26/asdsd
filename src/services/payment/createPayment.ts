import { prisma } from "../../db/prisma";
import { NewPayment } from "../../types/Payment";


export const createPayment = async(data: NewPayment) => {
    try {

        const {expenses,...rest} = data

        const payment = await prisma.payment.create({
             data:{
                ...rest,
                Expense:{
                    connect:expenses
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
        return payment
    } catch (error) {
        throw error
    }
}



