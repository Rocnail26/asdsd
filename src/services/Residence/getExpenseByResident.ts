import { Prisma } from "@prisma/client";
import { GetExpenseByResidence } from "../../types/Residence";
import { prisma } from "../../db/prisma";




export const getExpenseByResident = async ( data:GetExpenseByResidence) => {
    const {id,owedValue,limit,page,from,to} = data


    const query: Prisma.ExpenseFindManyArgs = {
        where:{
           residence_id:id,
           owedValue:{
            gt: !!owedValue  ? 0 : undefined  
           },
           OR:[
            {
                AND: [
                  { emitingDate: { gte: from } },
                  { emitingDate: { lte: to } }
                ]
              },
              {
                AND: [
                  { dayPayment: { gte: from } },
                  { dayPayment: { lte: to } }
                ]
              }
            ]
        },
        skip: (page - 1 ) * limit,
        take: limit, 
        }

    try {
       return await prisma.expense.findMany(query)
    } catch (error) {
        throw error
    }
}