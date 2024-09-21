import { NewParkingSlot } from "../../types/ParkingSlot";
import { prisma } from "../../db/prisma";



export const createParkingSlot = async(data:NewParkingSlot)  => {
    try {
        const parkingSlot = await prisma.parkingSlot.create({
            data
        })
        return parkingSlot
    } catch (error) {
        throw error
    }
}