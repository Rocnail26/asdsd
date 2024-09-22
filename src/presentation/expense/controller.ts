import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertAccountParams } from "../../types/Account";
import { createExpense, editExpense, getAllExpense, getExpense } from "../../services/Expense";
import { insertEditExpense, insertExpenseParams, insertGetAllExpenses, insertGetExpense } from "../../types/Expense";
import { handleError } from "../../utils/handleError";
import { Prisma } from "@prisma/client";

export const createExpenseController = async (req: Request, res: Response) => {
  try {
    
    const { id, community_id } = req.body.user;
    const body = req.body;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertExpenseParams.safeParseAsync({
      ...body,
      community_id,
    });
   
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
   
    const expense = await createExpense(data);
    return res.status(201).json(expense);
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllExpensesController = async (req: Request, res: Response) => {
  try {
    const { id, community_id } = req.body.user;
    const query = req.query
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const {data,error} = await insertGetAllExpenses.safeParseAsync({...query,community_id})
    if (error)
        return res.status(400).json({ error: error.flatten().fieldErrors });
      
    const expenses = await getAllExpense(data)
    return res.json(expenses)
  } catch (error) {
 
   return handleError(res,error)

  }
};

export const getExpenseController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertGetExpense.safeParseAsync({community_id,...params})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const expense = await getExpense(data)
        if(!expense) return res.status(400).json()
        return res.json(expense)
    } catch (error) {
        handleError(res,error)
    }
}

export const editExpenseController = async (req: Request, res: Response) => {
    try {
        const { id, community_id } = req.body.user;
        const params = req.params
        const body = req.body
        const admin = await isAdmin(id);
        if (!admin) return res.status(403).json("invalid admin");
        const {data,error} = await insertEditExpense.safeParseAsync({...body,...params,community_id, owedValue: new Prisma.Decimal(body.owedValue)})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const expense = await editExpense(data)
        return res.json(expense)
    } catch (error) {
        handleError(res,error)
    }
}