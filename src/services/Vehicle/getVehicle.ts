import { prisma } from "../../db/prisma";
import { GetVehicle } from "../../types/Vehicle";




export const getVehicle = async(data:GetVehicle) => {
    const {community_id,id} = data
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where:{
                id,
                User:{
                    community_id
                }
            },
            include:{
                User:true
            },
            
        })
        return vehicle
    } catch (error) {
        throw error        
    }
}