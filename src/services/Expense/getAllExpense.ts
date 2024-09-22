import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { GetAllExpenses } from "../../types/Expense";

export const getAllExpense = async (data: GetAllExpenses) => {
  const { from, to, limit, page, community_id } = data;

  const query: Prisma.ExpenseFindManyArgs = {
    where: {
      Residence: {
        Community: {
          id: community_id,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit
  };

  if (from) {
    query.where!.OR = [
      {
        emitingDate: {
          gte: from,
        },
      },
      {
        dayPayment: {
          gte: from,
        },
      },
    ];
  }

  if (to) {
    query.where!.OR = [
      {
        emitingDate: {
          lte: to,
        },
      },
      {
        dayPayment: {
          lte: to,
        },
      },
    ];
  }

  try {
    const expenses = prisma.expense.findMany(query);
    return expenses;
  } catch (error) {
    throw error;
  }
};
