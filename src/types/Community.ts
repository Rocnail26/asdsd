import { z } from "zod";
import { CommunitySchema } from "../db/zod";

const baseSchema = CommunitySchema

export const insertEditCommunity = baseSchema.pick({
    id:true,
    initSerialNumber:true
})


export type EditCommunity = z.infer<typeof insertEditCommunity>