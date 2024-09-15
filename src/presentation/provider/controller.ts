import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertEditProvider, insertGetAllProviders, insertGetProvider, insertProviderParams } from "../../types/Provider";
import { createProvider, editProvider, getAllProviders, getProvider } from "../../services/provider";
import { handleError } from "../../utils/handleError";



export const createProviderController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertProviderParams.safeParseAsync({...body,community_id})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const provider = await createProvider(data)
        return res.status(201).json(provider)   
    } catch (error) {
        handleError(res,error)
    }
}

export const getAllProvidersController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetAllProviders.safeParseAsync({community_id})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const providers = await getAllProviders(data)
        return res.json(providers)
    } catch (error) {
        handleError(res,error)
    }
} 

export const getProviderController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetProvider.safeParseAsync({community_id,...params})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const provider = await getProvider(data)
        if(!provider) return res.status(404).json({error:"provider no encontrado"})
        return res.json(provider)
    } catch (error) {
        handleError(res,error)
    }
}

export const editProviderController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const body = req.body
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertEditProvider.safeParseAsync({...body,community_id,...params})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const provider = await editProvider(data)
        return res.json(provider)
    } catch (error) {
        handleError(res,error)
    }
}