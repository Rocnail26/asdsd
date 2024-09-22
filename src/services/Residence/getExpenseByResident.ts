import { Prisma } from "@prisma/client";
import { GetExpenseByResidence } from "../../types/Residence";
import { prisma } from "../../db/prisma";




export const getExpenseByResident = async ( data:GetExpenseByResidence) => {
    const {id,owedValue,limit,page,from,to} = data


    const query: Prisma.ExpenseFindManyArgs = {
        where:{
           residence_id:id,
        },
        skip: (page - 1 ) * limit,
        take: limit, 
        }

    if(owedValue){
      query.where!.owedValue = {
            gt:0
        }
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