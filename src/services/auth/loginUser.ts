import { compare } from "bcrypt";
import { LoginUser } from "../../types/User";
import { prisma } from "../../db/prisma";

export const loginUser = async (userData: LoginUser) => {
  try {
    const { email, password } = userData;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
     
    });
    if (!user) throw new Error("usuario no existe");
    if(!user.password) throw new Error("usuario no verificado")

    const isValidPassword = await compare(password!, user.password);
    if (!isValidPassword) throw new Error("clave invalida");
    const {password:mainPassword,...rest} = user
    return {...rest}
  } catch (error) {
    throw error;
  }
};
