import { z } from "zod";
import { ProviderSchema } from "../db/zod";

const baseSchema = ProviderSchema


export const insertProviderParams = baseSchema.omit({
    id:true,    
    createdAt:true
})

export const insertGetAllProviders = baseSchema.pick({
    community_id:true
})

export const insertGetProvider = baseSchema.pick({
    id:true,
    community_id:true
})

export const insertEditProvider = baseSchema

export type NewProvider = z.infer<typeof insertProviderParams>
export type GetAllProviders = z.infer<typeof insertGetAllProviders>
export type GetProvider = z.infer<typeof insertGetProvider>
export type EditProvider = z.infer<typeof insertEditProvider>