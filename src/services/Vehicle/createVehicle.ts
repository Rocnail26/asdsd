import { prisma } from "../../db/prisma"
import { NewVehicle } from "../../types/Vehicle"

export const createVehicle = async(data:NewVehicle)  => {
    try {
        const vehicle = await prisma.vehicle.create({
            data
        })
        return vehicle
    } catch (error) {
        throw error
    }
}