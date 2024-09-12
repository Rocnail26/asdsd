import { prisma } from "../../db/prisma";
import { NewResidenceType } from "../../types/ResidenceType";

export const createResidenceType = async (data: NewResidenceType) => {
  try {
    const residenceType = await prisma.residenceType.create({
      data,
    });
    return residenceType
  } catch (error) {
    throw error;
  }
};
