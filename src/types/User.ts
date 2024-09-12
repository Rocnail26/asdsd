import { z } from "zod";
import { UserModel } from "../db/zod";



const baseSchema = UserModel


export const insertUserParams = baseSchema.omit({
    id:true,
    isActive:true,
    isVerified:true,
}).omit({
    password:true,
}).extend({
    residence_id: z.string().optional(),
    ownerOf: z.string().optional() 
})

export const insertLoginUser = baseSchema.pick({
    password:true,
    email: true
})

export const insertActivateUser = baseSchema.pick({
    password:true,
    id:true
})




export type NewUser = z.infer<typeof insertUserParams>
export type LoginUser = z.infer<typeof insertLoginUser>
export type ActivateUser = z.infer<typeof insertActivateUser>
export type User = z.infer<typeof baseSchema>