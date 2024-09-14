import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { NewUser } from "../../types/User";

export const registerUser = async (newUser: NewUser) => {
  try {

    let user = await prisma.user.findFirst({
      where: {
        email: newUser.email,
      },
    });

    if (user) throw new Error("usuario ya existe");

    const {ownerOf,...rest} = newUser

    const query : Prisma.UserCreateInput = {
        ...rest,
    }

    if(ownerOf){
      query.Residence = {
        connect: {
          id: ownerOf
        },
      }
    }

   
    const {password,...restUser} = await prisma.user.create({
      data:query
    });

    
    return {...restUser};
  } catch (error) {
    throw error;
  }
};
