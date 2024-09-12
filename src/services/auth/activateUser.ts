import { hash } from "bcrypt"
import { prisma } from "../../db/prisma"
import {ActivateUser} from "../../types/User"




export const activateUser = async({id,password}:ActivateUser):Promise<Boolean> => {

   try {
      const user = await prisma.user.findUnique({where:{
         id
      }})

      if(!user) throw new Error("usuario no encontrado")

      const hashedPassword = await hash(password!,10)   
      
      const result = await prisma.user.update({
         data: {
            password:hashedPassword,
            isActive:true,
            isVerified:true
         },
         where:{
             id
         }
      })

      return true

      } catch (error) {
         throw error
      }


}