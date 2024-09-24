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
            { emitingDate: { gte: from } }, 
            { dayPayment: { gte: from } },
            { emitingDate: { lte: to } }, 
            { dayPayment: { lte: to } }
           ]
        },
        skip: (page - 1 ) * limit,
        take: limit, 
        }


    if(from){
        query.where!.OR = [
            {
                emitingDate:{
                    gte:from
                }
            },
            {
                dayPayment:{
                    gte:from
                }
            }
        ]
    
    }

    if(to){
        query.where!.OR = [
            {
                emitingDate:{
                    lte:to
                }
            },
            {
                dayPayment:{
                    lte:to
                }
            }
        ]
    }
    

    try {
       return await prisma.expense.findMany(query)
    } catch (error) {
        throw error
    }
}