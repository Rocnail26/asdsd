import { z } from "zod";
import { ResidenceTypeModel } from "../db/zod";


const baseSchema = ResidenceTypeModel

export const insertResidenceTypeParams = baseSchema.omit({
id:true,
})

export const insertEditResidenceTypeParams = baseSchema.extend({
    id:z.coerce.number()
})


export type NewResidenceType = z.infer<typeof insertResidenceTypeParams>
export type EditResidenceType = z.infer<typeof insertEditResidenceTypeParams>