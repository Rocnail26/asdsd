import { prisma } from "../../db/prisma";
import { GetExpense } from "../../types/Expense";


export const getExpense = async(data: GetExpense) => {
    try {
        const expense = await prisma.expense.findUnique({
            where:{
                id:data.id,
                Residence:{
                    community_id: data.community_id
                }
            },
            include:{
                Residence:{
                    select:{
                        id:true,
                        title:true
                    }
                }
            }
        })
        return expense
    } catch (error) {
        throw error
    }
}