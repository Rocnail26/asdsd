import { prisma } from "../../db/prisma";
import { getUsers } from "../../types/User";


export const getUser = async (data:getUsers) => {
        try {
            const user = prisma.user.findUnique({
                where:{
                    ...data
                },
                include:{
                    Community:true,
                    PaymentsCreated:true,
                    Residence:true,
                    ResidentIn:true,
                    Role:true
                },
                omit:{
                    community_id:true,
                    residence_id:true,
                    role_id:true,
                }
            })
            if(!user) return undefined
            return user
        } catch (error) {
            throw error
        }
}