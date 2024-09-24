import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { GetAllExpenses } from "../../types/Expense";

export const getAllExpense = async (data: GetAllExpenses) => {
  const { from, to, limit, page, community_id } = data;
  console.log(limit,page)
  const query: Prisma.ExpenseFindManyArgs = {
    where: {
      Residence:{
        community_id
      },
    
      OR: [
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
    skip: (page - 1) * limit,
    take: limit,
  };
  
  try {
    const expenses = prisma.expense.findMany(query);
    return expenses;
  } catch (error) {
    throw error;
  }
};
