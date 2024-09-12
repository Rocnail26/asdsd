import { prisma } from "../../db/prisma";
import { NewResidence } from "../../types/Residence";


export const createResidence = async(data:NewResidence) => {

try {
    
    const residence = await prisma.residence.create({
        data
    })

    return residence

} catch (error) {
    throw error
}

}