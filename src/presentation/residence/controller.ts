import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import {
  insertGetAllResidenceParams,
  insertGetResidenceParams,
  insertResidenceParams,
} from "../../types/Residence";
import { createResidence, getAllResidences, getResidence } from "../../services/Residence";


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
    console.log(data)
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
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
    console.log(relations);
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
  console.log(residence)
    return res.json(residence)
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json(error);
  }


}
