import { prisma } from "../../db/prisma";
import { GetParkingSlot } from "../../types/ParkingSlot";



export const getParkingSlot = async(data:GetParkingSlot) => {
    try {
        const parkingSlot = await prisma.parkingSlot.findUnique({
            where:{
                ...data
            },
            include:{
                User:true,
                Community:true
            }
        })
        return parkingSlot
    } catch (error) {
        throw error        
    }
}