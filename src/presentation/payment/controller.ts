import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertAccountParams } from "../../types/Account";
import { handleError } from "../../utils/handleError";
import { createPayment, editPayment, getAllPayment, getpayment } from "../../services/payment";
import { insertEditPayment, insertGetAllPayments, insertGetPayment, insertPaymentParams } from "../../types/Payment";
import { Prisma } from "@prisma/client";


export const createPaymentController = async(req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertPaymentParams.safeParseAsync({...body,created_by:id,amount: new Prisma.Decimal(body.amount)})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const payment = await createPayment(data)
        res.status(201).json(payment)
    } catch (error) {
      handleError(res,error)   
    }
}


export const getAllPaymentsController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetAllPayments.safeParseAsync({community_id})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const payments = await getAllPayment(data)
        return res.json(payments)
    } catch (error) {
        handleError(res,error)
    }
}

export const getPaymentController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetPayment.safeParseAsync({...params,community_id})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const payment = await getpayment(data)
        return res.json(payment)
    } catch (error) {
        handleError(res,error)
    }
}

export const editPaymentController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body
        const params = req.params
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertEditPayment.safeParseAsync({...body,...params,community_id})
        if(error) return res.status(400).json({error: error.flatten().fieldErrors})
        const payment = await editPayment(data)
        return res.json(payment)    
    } catch (error) {
        handleError(res,error)
    }
}