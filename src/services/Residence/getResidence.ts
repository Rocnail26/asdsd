import { prisma } from "../../db/prisma";
import { GetResidence } from "../../types/Residence";


export const getResidence = async(data:GetResidence) => {
try {
          
    const residence = await prisma.residence.findUnique({
        where:{
            ...data
        },
        include: {
            Community:true,
            Expense:true,
            Owner:true,
            ParkingSlot: true,
            ResidenceType: true,
            Resident: true
        },
        omit:{
           
            owner_id:true,
            residenceType_id: true,

        }
    })
    console.log(residence)
    if(!residence) throw new Error("residencia no encontrada")
    return residence    
} catch (error) {
    throw error
}

}