import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertCashoutSchema, insertEditCashout, insertGetAllCashout, insertGetCashout } from "../../types/Cashout";
import { createCashout, editCashout, getAllCashouts, getCashout } from "../../services/cashout";
import { handleError } from "../../utils/handleError";
import { Prisma } from "@prisma/client";



export const createCashoutController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertCashoutSchema.safeParseAsync({...body,amount: new Prisma.Decimal(body.amount)})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const cashout = await createCashout(data)
        return res.status(201).json(cashout)
    } catch (error) {
        handleError(res,error)
    }
}

export const getAllCashoutsController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetAllCashout.safeParseAsync({community_id})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const cashouts = await getAllCashouts(data)
        return res.json(cashouts)
    } catch (error) {
        handleError(res,error)
    }
}

export const getCashoutController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetCashout.safeParseAsync({...params,community_id})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const cashout = await getCashout(data)
        return cashout ? res.json(cashout) : res.status(404).json({error: "cashout no encontrado"})
    } catch (error) {
        handleError(res,error)
    }
}

export const editCashoutController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const body = req.body
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertEditCashout.safeParseAsync({...body,...params,community_id})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const cashout = await editCashout(data)
        return res.json(cashout)
    } catch (error) {
        handleError(res,error)
    }
}