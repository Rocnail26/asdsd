import { prisma } from "../../db/prisma";
import { EditParkingSlot } from "../../types/ParkingSlot";

export const editParkingSlot =  async(data: EditParkingSlot) => {
    try {
        const {community_id,id,...rest} = data
        const existParking = await prisma.parkingSlot.findUnique({
            where:{
                id,
                community_id
            }
        })
        if(!existParking) throw new Error("Estacionamiento no encontrado")
        
        return await prisma.parkingSlot.update({
            where:{
                community_id,
                id
            },
            data:{
                ...rest
            }
        })
    } catch (error) {
        throw error
    }
}