import { Prisma } from "@prisma/client";
import {  GetPaymentByResidence } from "../../types/Residence";
import { prisma } from "../../db/prisma";




export const getPaymentsByResidence = async ( data:GetPaymentByResidence) => {
    const {id,limit,page,from,to} = data
   
    const query: Prisma.PaymentFindManyArgs = {
        where:{
           AND: [
            {registerDate: {gte: from}},
            {registerDate: {lte: to}}
           ],
           Expense:{
                some:{
                    residence_id:id
                }
           }
        },
        skip: (page - 1 ) * limit,
        take: limit,
         include:{
            Expense:{
                orderBy:{
                    createdAt:"desc"
                }
            }
         },
         orderBy:{
            createdAt: "desc"
         }
        }


    try {
       return await prisma.payment.findMany(query)
    } catch (error) {
        throw error
    }
}