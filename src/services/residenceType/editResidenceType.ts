import { prisma } from "../../db/prisma"
import { EditResidenceType } from "../../types/ResidenceType"

export const editResidenceType = async(data:EditResidenceType) => {

  try {
    const {id,community_id,description,title} = data

    const residenceType = await prisma.residenceType.findUnique({
        where:{
          id: id,
          community_id
        }
      })
  
      if(!residenceType) throw new Error("no existe el tipo de residencia")
      
      return await prisma.residenceType.update({
        where:{
          id
        },
        data: {
          description,
          title
        }
      })  
      
      
  } catch (error) {
    throw error
  }

}