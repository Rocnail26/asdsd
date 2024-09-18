import { prisma } from "../../db/prisma";
import { GetAllExpenses } from "../../types/Expense";


export const getAllExpense = async(data: GetAllExpenses) => {
    try {
        const expenses = prisma.expense.findMany({
            where:{
                Residence:{
                    Community:{
                        id: data.community_id
                    }
                }
            }
        })
        return expenses
    } catch (error) {
        throw error
    }
}