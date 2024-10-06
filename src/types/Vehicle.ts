import { z } from "zod";
import { VehicleSchema } from "../db/zod";

const baseSchema = VehicleSchema

export const insertVehicleParams = baseSchema.omit({
    id:true,
    createdAt:true
})

export const insertGetVehicle = baseSchema.extend({
    community_id: z.string(),
    id:z.coerce.number()
}).pick({
    community_id:true,
    id:true
})

export const insertGetAllVehicles = insertGetVehicle.omit({
    id:true
})

export const insertEditVehicle = baseSchema.partial().extend({id:z.coerce.number(),community_id:z.string()})

export type NewVehicle = z.infer<typeof insertVehicleParams>
export type GetAllVehicles = z.infer<typeof insertGetAllVehicles>
export type GetVehicle = z.infer<typeof insertGetVehicle>
export type EditVehicle = z.infer<typeof insertEditVehicle>