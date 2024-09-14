import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertAccountParams, insertEditAccount, insertGetAccount, insertGetAllAccounts } from "../../types/Account";
import { handleError } from "../../utils/handleError";
import { createAccount, editAccount, getAccount, getAllAccounts } from "../../services/account";
import { isValid } from "zod";



export const createAccountController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertAccountParams.safeParseAsync({...body,community_id})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const account = await createAccount(data)
        return res.status(201).json(account)


    } catch (error) {
        handleError(res,error)
    }
}

export const getAllAccountsController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user
        const isValidAdmin = await isAdmin(id);
        if (!isValidAdmin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetAllAccounts.safeParseAsync({community_id})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const accounts = await getAllAccounts(data)
        return res.json(accounts)
    } catch (error) {
        handleError(res,error)
    }
}


export const getAccountController = async (req: Request, res: Response) => {
    try {
        const { id : adminId, community_id } = req.body.user
        const {id} = req.params
        const isValidAdmin = await isAdmin(adminId);
        if (!isValidAdmin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetAccount.safeParseAsync({id,community_id})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const account = await getAccount(data)
        if(!account) return res.status(404).json({error: "account no encontrado"})
        return res.json(account)
    } catch (error) {   
        handleError(res,error)
    }
}


export const editAccountController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user
        const body = req.body
        const params = req.params
        const isValidAdmin = await isAdmin(id);
        if (!isValidAdmin) return res.status(403).json("invalid admin");
        const {data,error} = await insertEditAccount.safeParseAsync({community_id,...body,...params})
        if(error) return res.status(400).json({error:error.flatten().fieldErrors})
        const account = await editAccount(data)
        if(!account) return res.status(404).json({error: "account no encontrada"})
        return res.json(account)
    } catch (error) {
        handleError(res,error)
    }
}