import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { getAllRoles } from "../../services/role";


export const getAllRolesController = async(req:Request, res:Response) => {
    try {
        const { id } = req.body.user;
        const isValidAdmin = await isAdmin(id);
        if (!isValidAdmin) res.status(403).json({ error: "admin invalido" });
        const roles = await getAllRoles()
        return res.json(roles)
    } catch (error) {
        if(error instanceof Error) return res.status(400).json({error:error.message})
        return res.status(500).json(error)
    }
}