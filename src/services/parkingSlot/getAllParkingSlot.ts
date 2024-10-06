import { prisma } from "../../db/prisma";
import { GetAllParkingSlot } from "../../types/ParkingSlot";

export const getAllParkingSlot = async(data:GetAllParkingSlot) => {
    try {
        const parkingSlots = await prisma.parkingSlot.findMany({
            where:{
                ...data
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return parkingSlots
    } catch (error) {
        throw error
    }
}