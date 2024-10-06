import { z } from "zod";
import { ParkingSlotSchema } from "../db/zod";

const baseSchema = ParkingSlotSchema

export const insertParkingSlotParams = baseSchema.omit({
    id:true,
    createdAt:true
})   

export const insertGetAllParkingSlot = baseSchema.extend({
    community_id:z.string()
}).pick({
    community_id:true
})

export const insertGetParkingSlot = insertGetAllParkingSlot.extend({
    id:z.string()
})

export const insertEditParkingSlot = baseSchema.partial().extend({id:z.string(),community_id:z.string()})


export type NewParkingSlot = z.infer<typeof insertParkingSlotParams>
export type GetParkingSlot = z.infer<typeof insertGetParkingSlot>
export type GetAllParkingSlot = z.infer<typeof insertGetAllParkingSlot>
export type EditParkingSlot = z.infer<typeof insertEditParkingSlot>