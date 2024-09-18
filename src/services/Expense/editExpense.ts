import exp from "constants";
import { prisma } from "../../db/prisma";
import { EditExpense } from "../../types/Expense";


export const editExpense = async (data: EditExpense) => {
  const { id, community_id, ...rest } = data;
  try {
    const isExpense = prisma.expense.findUnique({
      where: {
        id,
         Residence:{
          community_id
         }
      },
    });
    if (!isExpense) throw new Error("expensa no encontrada");
    const expense = await prisma.expense.update({
        where:{
            id,
            Residence:{
              community_id
            }
        },
        data:{
            ...rest
        }
    });

    return expense
  } catch (error) {
    throw error
  }
};
