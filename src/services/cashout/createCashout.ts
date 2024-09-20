import { prisma } from "../../db/prisma";
import { NewCashout } from "../../types/Cashout";

const createCashout = async (data: NewCashout) => {
  const { account_id, amount, status } = data;
  try {
    if (status == "Paid") {
      const account = prisma.account.findUnique({
        where: {
          id: account_id,
          balance: {
            gte: amount,
          },
        },
      });

      if (!account) throw new Error("balance insuficiente");
    }

    const cashout = await prisma.cashout.create({
      data,
    });

    return cashout;
  } catch (error) {
    throw error;
  }
};
