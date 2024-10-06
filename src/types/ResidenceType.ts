import { z } from "zod";
import { ResidenceTypeSchema } from "../db/zod";



const baseSchema = ResidenceTypeSchema

export const insertResidenceTypeParams = baseSchema.omit({
id:true,
createdAt:true
})

export const insertEditResidenceTypeParams = baseSchema.extend({
    id:z.coerce.number()
})


export type NewResidenceType = z.infer<typeof insertResidenceTypeParams>
export type EditResidenceType = z.infer<typeof insertEditResidenceTypeParams>