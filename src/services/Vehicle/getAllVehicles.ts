import { prisma } from "../../db/prisma";
import { GetAllVehicles } from "../../types/Vehicle";


export const getAllVehicles = async(data:GetAllVehicles) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where:{
                User:{
                    community_id:data.community_id
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return vehicles
    } catch (error) {
        throw error
    }
}