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
      Owner: {
        select:{
          phone:true,
          firstName:true,
        }
      },
      ResidenceType: {
        select:{
          title:true,
          description:true
        }
      },
      Resident:{
        select:{
          firstName:true,
          phone:true,
        },
        take: 1,
        orderBy:{
          createdAt: "desc"
        }
      }
    };
  
  }

  try {
    const residences = await prisma.residence.findMany(query);
    return residences
  } catch (error) {
    throw error
  }
};
