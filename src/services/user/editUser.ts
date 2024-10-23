import { prisma } from "../../db/prisma"
import { EditUser } from "../../types/User"
import { existUserName } from "./existUserName"

export const editUser = async(data:EditUser) => {
    const {userName,community_id,id, ...rest} = data
    try {
        if(userName  && await existUserName({userName,community_id})) throw new Error("este userName ya existe")   
        const existUser = await prisma.user.findUnique({
            where:{
                id,
                community_id
            }
        })

        if(!existUser) throw new Error("Este usuario no existe")
        
        const user = await prisma.user.update({
            data:{
                ...rest,
                userName
            },
            where:{
                community_id,
                id
            },
            omit:{
                password:true,     
            }
        })
        return user
    } catch (error) {
        throw error
    }

}