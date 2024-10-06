import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { GetAllUsers } from "../../types/User";




export const getAllUsers = async(data:GetAllUsers) => {
        const {community_id,relations} = data
        const query:Prisma.UserFindManyArgs = {
            where:{
                community_id,
                role_id: {
                    not: 1
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        } 

        if(relations){
            query.include = {
                Community:true,
                PaymentsCreated:true,
                Residence:true,
                ResidentIn:true,
                Role:true
            }
            query.omit = {
                community_id:true,
                residence_id:true,
                role_id:true,
                password:true
            }
        }

        try {
            const users = await prisma.user.findMany(query)
            return users
        } catch (error) {
            throw error
        }
}