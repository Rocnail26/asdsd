import { z } from "zod";
import { ResidenceSchema } from "../db/zod";
import {  FilterDateSchema, PaginationSchema } from "./Global";





const baseSchema = ResidenceSchema

export const insertResidenceParams = baseSchema.omit({
    contacts:true,
    id: true,
    owner_id:true,
    createdAt:true
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

export const insertGetExpenseByResidence = baseSchema.pick({
    id:true
}).extend({owedValue: z.coerce.boolean().optional()}).merge(PaginationSchema).merge(FilterDateSchema)

export const insertGetPaymentsByResidence = baseSchema.pick({
    id:true
}).merge(PaginationSchema).merge(FilterDateSchema)

export type NewResidence = z.infer<typeof insertResidenceParams>
export type GetAllResidence = z.infer<typeof insertGetAllResidenceParams>
export type GetResidence = z.infer<typeof insertGetResidenceParams >
export type GetExpenseByResidence = z.infer<typeof insertGetExpenseByResidence>
export type GetPaymentByResidence = z.infer<typeof insertGetPaymentsByResidence>