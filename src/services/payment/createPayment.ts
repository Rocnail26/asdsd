import { prisma } from "../../db/prisma";
import { NewPayment } from "../../types/Payment";


export const createPayment = async(data: NewPayment) => {
    try {
        const payment = prisma.payment.create({
             data
        })
        return payment
    } catch (error) {
        throw error
    }
}



