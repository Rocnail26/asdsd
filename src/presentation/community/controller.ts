import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertEditCommunity } from "../../types/Community";
import { editCommunity } from "../../services/community/editCommunity";
import { handleError } from "../../utils/handleError";


export const editCommunityController = async(req:Request,res:Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const body = req.body
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");3
        if(community_id !== params.id) return res.status(403).json({error:"no tienes permiso para editar esta comunidad"})
        const {data,error} = await insertEditCommunity.safeParseAsync({...body,...params})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const community = await editCommunity(data)
        return res.json(community)
    } catch (error) {
        handleError(res,error)
    }
}