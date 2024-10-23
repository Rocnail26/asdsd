import { z } from "zod";
import {  UserSchema } from "../db/zod";



const baseSchema = UserSchema


export const insertUserParams = baseSchema.omit({
    id:true,
    isActive:true,
    isVerified:true,
    createdAt:true
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

export const insertGetAllUsers = baseSchema.pick({
    community_id:true
}).extend({
    relations: z.coerce.boolean()
})


export const insertGetUser = baseSchema.pick({
    community_id:true,
    id: true
})

export const insertEditUser = baseSchema.pick({
    email:true,
    lastName:true,
    role_id:true,
    phone:true,
    userName:true,
    residence_id:true,
    firstName:true,
    identification:true
}).partial().extend({
    id:z.string(),
    community_id: z.string()
})



export type NewUser = z.infer<typeof insertUserParams>
export type LoginUser = z.infer<typeof insertLoginUser>
export type ActivateUser = z.infer<typeof insertActivateUser>
export type User = z.infer<typeof baseSchema>
export type GetAllUsers = z.infer<typeof insertGetAllUsers>
export type getUsers = z.infer<typeof insertGetUser>
export type EditUser = z.infer<typeof insertEditUser>