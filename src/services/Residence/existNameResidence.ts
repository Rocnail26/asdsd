import { prisma } from "../../db/prisma";

interface Props {
  community_id: string;
  title: string;
}

export const existNameResidence = async (value: Props): Promise<boolean> => {
  try {
    const exist = await prisma.residence.findFirst({
      where: value,
    });
    return !!exist;
  } catch (error) {
    throw error;
  }
};
