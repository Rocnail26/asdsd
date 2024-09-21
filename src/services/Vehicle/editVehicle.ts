import { prisma } from "../../db/prisma"
import { EditVehicle } from "../../types/Vehicle"

export const editVehicle =  async(data: EditVehicle) => {
    try {
        const {community_id,id,...rest} = data
        const existParking = await prisma.vehicle.findUnique({
            where:{
                id,
                User:{
                    community_id
                }
            }
        })
        if(!existParking) throw new Error("Vehiculo no encontrado no encontrado")
        
        return await prisma.vehicle.update({
            where:{
                id,
                User:{
                    community_id
                }
            },
            data:{
                ...rest
            }
        })
    } catch (error) {
        throw error
    }
}