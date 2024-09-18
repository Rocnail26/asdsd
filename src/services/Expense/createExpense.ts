import { prisma } from "../../db/prisma";
import { NewExpense } from "../../types/Expense";



export const createExpense = async(data:NewExpense) => {
    try {
        const expense = await prisma.expense.create({
            data
        })

        return expense
    } catch (error) {
       throw error        
    }
}