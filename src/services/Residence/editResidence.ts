import { prisma } from "../../db/prisma";
import { UpdateResidence } from "../../types/Residence";

export const editResidence = async ({id,community_id,contacts,...rest}:UpdateResidence) => {
    try {
        const existResidence = await prisma.residence.findUnique({
            where:{
                id,
                community_id
            }
        })

        if(!existResidence) throw new Error("esta residencia no existe")
        
        const updatedResidence = await prisma.residence.update({
            where:{
                id,
                community_id
            },
            data:{
                ...rest,
                ...{contacts: contacts || undefined}
            }
        })

        return updatedResidence
    } catch (error) {
        throw error
    }
}