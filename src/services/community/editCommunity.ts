import { Prisma } from "@prisma/client";
import { EditCommunity } from "../../types/Community";
import { prisma } from "../../db/prisma";

export const editCommunity = async (community: EditCommunity) => {
  try {
    const { id,initSerialNumber } = community;
    const existCommunity = await prisma.community.findMany({ where: { id } });
    if (!existCommunity) throw new Error("la comunidad no existe");
    return await prisma.community.update({
        where:{
            id
        },
        data:{
            initSerialNumber
        }
    })
  } catch (error) {
    throw error;
  }
};
