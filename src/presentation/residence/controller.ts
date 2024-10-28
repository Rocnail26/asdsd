import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import {
  insertEditResidence,
  insertGetAllResidenceParams,
  insertGetExpenseByResidence,
  insertGetPaymentsByResidence,
  insertGetResidenceParams,
  insertResidenceParams,
} from "../../types/Residence";
import { createResidence, getAllResidences, getExpenseByResidence, getResidence ,getPaymentsByResidence} from "../../services/Residence";
import { handleError } from "../../utils/handleError";
import { existNameResidence } from "../../services/Residence/existNameResidence";
import { editResidence } from "../../services/Residence/editResidence";


export const createResidenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, community_id } = req.body.user;
    const body = req.body;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertResidenceParams.safeParseAsync({
      ...body,
      community_id,
    });
    if (error) 
      return res.status(400).json({ error: error.flatten().fieldErrors });
    const existTitle = await existNameResidence(data)
    if(existTitle) return res.status(400).json({error:"este nombre de residencia ya existe"})
    const residence = await createResidence(data);
    return res.status(202).json(residence);
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });

    return res.status(400).json(error);
  }
};

export const getAllRecidencesController = async (req: Request, res: Response) => {
  try {
    const { id, community_id } = req.body.user;
    const { relations } = req.query;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
   
    const { data, error } = await insertGetAllResidenceParams.safeParseAsync({
      community_id,
      relations,
    });
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
    const residences = await getAllResidences(data);
    return res.json(residences);
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json(error);
  }
};

export const getResidenceController = async (req: Request, res: Response) => {

  try {
    const {community_id} = req.body.user
    const {id} = req.params                 
    const {data,error} = await insertGetResidenceParams.safeParseAsync({community_id,id})
    if(error) return res.status(400).json({error: error.flatten().fieldErrors})
    const residence = await getResidence(data)
    return res.json(residence)
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json(error);
  }


}

export const getExpensesByResidentController = async (req: Request, res: Response) => {
  try {
    const { id, community_id } = req.body.user;
    const params = req.params
    const query = req.query
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const {data,error} = await insertGetExpenseByResidence.safeParseAsync({...params,...query})
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
    
    const expenses = await getExpenseByResidence(data)

    return res.json(expenses)

  } catch (error) {
    handleError(res,error)
  }
}

export const getPaymentsByResidenceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body.user;
    const params = req.params
    const query = req.query
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const {data,error} = await insertGetPaymentsByResidence.safeParseAsync({...params,...query})
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
    
    const payments = await getPaymentsByResidence(data)

    return res.json(payments)

  } catch (error) {
    handleError(res,error)
  }
}

export const updateResidenceController = async (req:Request,res:Response) => {
  try {
    const { id:userId, community_id } = req.body.user;
    const body = req.body;
    const {id} = req.params
    const admin = await isAdmin(userId);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertEditResidence.safeParseAsync({
      ...body,
      id,
      community_id,
    });
    if (error) 
      return res.status(400).json({ error: error.flatten().fieldErrors });
    if(data.title){
      const existTitle = await existNameResidence({title:data.title,community_id})
      if(existTitle) return res.status(400).json({error:"este nombre de residencia ya existe"})
    }
    const residence = await editResidence(data)
    return res.json(residence)
  } catch (error) {
    handleError(res,error)
  }
}