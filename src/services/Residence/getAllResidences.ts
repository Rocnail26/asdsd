import { SelectField } from "@prisma/client/runtime/library";
import { prisma } from "../../db/prisma";
import { GetAllResidence } from "../../types/Residence";
import { Prisma } from "@prisma/client";

export const getAllResidences = async (data: GetAllResidence) => {
  const { community_id, relations } = data;
  const query: Prisma.ResidenceFindManyArgs = {
    where: {
      community_id,
    },
    orderBy:{
    createdAt: "desc"   
    }
  };

  if (relations) {
    query.omit = {
      community_id:true,
      owner_id: true,
      residenceType_id: true,
    }
    query.include = {
      Owner: true,
      Community: true,
      Expense: {
        orderBy:{
          createdAt:"desc"
        }
      },
      ResidenceType: true,
      Resident: true,
    };
  
  }

  try {
    const residences = await prisma.residence.findMany(query);
    return residences
  } catch (error) {
    throw error
  }
};
