import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

export const existUserName = async ({
  community_id,
  userName,
}: {
  userName: string;
  community_id: string;
}): Promise<boolean> => {
  try {
    const existUserName = await prisma.user.findFirst({
      where: {
        userName,
        community_id,
      },
    });

    return !!existUserName;
  } catch (error) {
    throw error
  }
};
