import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertAccountParams } from "../../types/Account";
import { createExpense, editExpense, getAllExpense, getExpense } from "../../services/Expense";
import { insertEditExpense, insertExpenseParams, insertGetAllExpenses, insertGetExpense } from "../../types/Expense";
import { handleError } from "../../utils/handleError";

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
    console.log("ghola")
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
    console.log("hola")
    const expense = await createExpense(data);
    return res.status(201).json(expense);
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllExpensesController = async (req: Request, res: Response) => {
  try {
    const { id, community_id } = req.body.user;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const {data,error} = await insertGetAllExpenses.safeParseAsync({community_id})
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
        const {data,error} = await insertEditExpense.safeParseAsync({...body,...params,community_id})
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const expense = await editExpense(data)
        return res.json(expense)
    } catch (error) {
        handleError(res,error)
    }
}