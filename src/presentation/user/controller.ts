import { Request, Response } from "express";
import { insertGetAllUsers, insertGetUser } from "../../types/User";
import { getAllUsers, getUser, isAdmin } from "../../services/user";




export const getAlluserController = async(req:Request, res:Response) => {
    try {
        const {id,community_id} = req.body.user
        const query = req.query
        const isValidAdmin = await isAdmin(id)
        if(!isValidAdmin) return res.status(403).json({error:"invalid user"})
        const {data,error} = await insertGetAllUsers.safeParseAsync({community_id,...query})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const users = await getAllUsers(data)
        return res.json(users)
    } catch (error) {
        if(error instanceof Error) return res.status(400).json({error:Error})
        return error
    }
}

export const getUserController = async(req: Request, res:Response) => {
    try {
        const {id:userId,community_id} = req.body.user
        const {id} = req.params
        const isValidAdmin = await isAdmin(userId)
        const {data,error} = await insertGetUser.safeParseAsync({id,community_id})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const user = await getUser(data)
        if(!user ) return res.status(404).json({error:"usuario no encontrado"})
        if(user?.id != userId && !isValidAdmin) return res.status(403).json("invalid user")
        return res.json(user)        
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json(error.message)
        }
        return res.status(500).json(error)
    }
}