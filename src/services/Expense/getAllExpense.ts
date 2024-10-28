import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { GetAllExpenses } from "../../types/Expense";

export const getAllExpense = async (data: GetAllExpenses) => {
  const { from, to, limit, page, community_id } = data;
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
        },
        ...(!from && !to ? [{emitingDate:{ gte: new Date(0)}}, {dayPayment:{ gte: new Date(0)}}] : [])
      ]
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    include:{
      Residence: {
        select: {
          id:true,
          title:true,
        }
      }
    }
   
  };
  
  try {
    const expenses = prisma.expense.findMany(query);
    return expenses;
  } catch (error) {
    throw error;
  }
};
