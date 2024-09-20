import { prisma } from "../../db/prisma";
import { NewCashout } from "../../types/Cashout";

export const createCashout = async (data: NewCashout) => {
  const { account_id, amount, status } = data;
  try {
    if (status == "Paid") {
      const account = await prisma.account.findUnique({
        where: {
          id: account_id,
          balance: {
            gte: amount,
          },
        },
      });

      if (!account) throw new Error("balance insuficiente");

      await prisma.account.update({
        where: {
          id: account_id,
          balance: {
            gte: amount,
          },
        },
        data:{
          balance:{
            decrement: amount,
          },
        },
      });
    }

    const cashout = await prisma.cashout.create({
      data,
    });

    return cashout;
  } catch (error) {
    throw error;
  }
};
