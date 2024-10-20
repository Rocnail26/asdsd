import { prisma } from "../../db/prisma";
import { GetResidence } from "../../types/Residence";


export const getResidence = async(data:GetResidence) => {
try {
    const residence = await prisma.residence.findUnique({
        where:{
            ...data
        },
        include: {
            Owner: {
                omit:{
                    role_id:true,
                    password:true,
                    community_id:true,
                    isActive:true,
                    isVerified:true,
                    residence_id:true,
                    createdAt:true
                }
            },
            ResidenceType: {
                select:{
                     title:true,
                     description:true
                }
            },
            Resident: {
                select:{
                    id:true,
                    firstName:true,
                    lastName:true,
                    phone:true,
                    email:true
                }
            }
        },
        omit:{
            owner_id:true,
            residenceType_id: true,
        }
    })
    if(!residence) throw new Error("residencia no encontrada")
    return residence    
} catch (error) {
    throw error
}
}