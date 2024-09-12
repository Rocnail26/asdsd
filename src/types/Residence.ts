import { z } from "zod";
import { ResidenceSchema } from "../db/zod";





const baseSchema = ResidenceSchema

export const insertResidenceParams = baseSchema.omit({
    contacts:true,
    id: true,
    owner_id:true,
})

export const insertGetAllResidenceParams = baseSchema.extend({
    relations: z.coerce.boolean().optional()
}).pick({
    relations:true,
    community_id: true
})

export const insertGetResidenceParams = baseSchema.pick({
    id:true,
    community_id: true
})

export type NewResidence = z.infer<typeof insertResidenceParams>
export type GetAllResidence = z.infer<typeof insertGetAllResidenceParams>
export type GetResidence = z.infer<typeof insertGetResidenceParams >