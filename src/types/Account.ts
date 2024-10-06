import { z } from "zod";
import { AccountSchema } from "../db/zod";

const baseSchema = AccountSchema

export const insertAccountParams = baseSchema.omit({
    id:true,
    createdAt:true
}).extend({
 balance: z.coerce.number()
})

export const insertGetAllAccounts = baseSchema.pick({
    community_id:true
})


export const insertGetAccount = baseSchema.pick({
    community_id:true,
    id: true
})

export const insertEditAccount = baseSchema.omit({
    balance:true,
})

export type NewAccount = z.infer<typeof insertAccountParams>
export type GetAllAccounts = z.infer<typeof insertGetAllAccounts>
export type GetAccount = z.infer<typeof insertGetAccount>
export type ediAccount = z.infer<typeof insertEditAccount>