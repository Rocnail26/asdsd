import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertUserParams } from "../../types/User";
import { createResidenceType } from "../../services/residenceType/createResideceType";
import { insertEditResidenceTypeParams, insertResidenceTypeParams } from "../../types/ResidenceType";
import { editResidenceType, getAllResidenceType } from "../../services/residenceType";
import { prisma } from "../../db/prisma";

export const createResidenceTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, community_id } = req.body.user;
    const body = req.body;
    const isValidAdmin = await isAdmin(id);
    if (!isValidAdmin) res.status(403).json({ error: "admin invalido" });
    const { error, data } = await insertResidenceTypeParams.safeParseAsync({
      ...body,
      community_id,
    });
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });

    const residenceType = await createResidenceType(data);

    res.status(202).json(residenceType);
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });

    return res.status(400).json({ error });
  }
};

export const getAllResidenceTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { community_id } = req.body.user;
    const residenceTypes = await getAllResidenceType(community_id);
    return res.json(residenceTypes);
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });

    return res.status(500);
  }
};

export const editResidenceTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id:userId,community_id } = req.body.user;
    const {id} = req.params
    const body = req.body
    const isValidAdmin = await isAdmin(userId);
    if (!isValidAdmin) res.status(403).json({ error: "admin invalido" });
    const {data,error} = await insertEditResidenceTypeParams.safeParseAsync({...body,id,community_id}) 
    if(error) return res.status(400).json({error:error.flatten().fieldErrors})
    const residenceType = await editResidenceType(data)
    return res.json(residenceType)
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });

    return res.status(500);
  }
};
