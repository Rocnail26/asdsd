import { z } from "zod";
import { CashoutSchema } from "../db/zod";

const baseSchema  = CashoutSchema

export const insertCashoutSchema = baseSchema.omit({
    id:true
})

export const insertGetCashout = baseSchema.pick({
    id:true
}).extend({
    community_id: z.string()
})


export const insertGetAllCashout = insertGetCashout.pick({
    community_id:true
})

export const insertEditCashout = baseSchema.partial().extend({id:z.string(), community_id:z.string()})


export type NewCashout = z.infer<typeof insertCashoutSchema>
export type GetCashout = z.infer<typeof insertGetCashout>
export type GetAllCashouts = z.infer<typeof insertGetAllCashout>
export type EditCashout = z.infer<typeof insertEditCashout>