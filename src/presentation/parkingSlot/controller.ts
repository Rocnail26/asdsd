import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import {
  insertEditParkingSlot,
  insertGetAllParkingSlot,
  insertGetParkingSlot,
  insertParkingSlotParams,
} from "../../types/ParkingSlot";
import {
  createParkingSlot,
  editParkingSlot,
  getAllParkingSlot,
  getParkingSlot,
} from "../../services/parkingSlot";
import { handleError } from "../../utils/handleError";

export const createParkingSlotController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, community_id } = req.body.user;
    const body = req.body;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertParkingSlotParams.safeParseAsync({
      ...body,
      community_id,
    });

    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });

    const parkingSlot = await createParkingSlot(data);

    return res.status(201).json(parkingSlot);
  } catch (error) {
    handleError(res, error);
  }
};

export const getParkingSlotController = async (req: Request, res: Response) => {
  try {
    const { id, community_id } = req.body.user;
    const params = req.params;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertGetParkingSlot.safeParseAsync({
      ...params,
      community_id,
    });

    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });

    const parkingSlot = await getParkingSlot(data);
    if (!parkingSlot) return res.status(404).json(parkingSlot);

    return res.json(parkingSlot);
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllParkingSlotController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, community_id } = req.body.user;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertGetAllParkingSlot.safeParseAsync({
      community_id,
    });
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
    const parkingSlots = await getAllParkingSlot(data);
    return res.json(parkingSlots);
  } catch (error) {
    handleError(res, error);
  }
};

export const editParkingSlotController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, community_id } = req.body.user;
    const body = req.body;
    const params = req.params;
    const admin = await isAdmin(id);
    if (!admin) return res.status(403).json("invalid admin");
    const { data, error } = await insertEditParkingSlot.safeParseAsync({
      ...body,
      ...params,
      community_id,
    });

    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });

    const parkingSlot = await editParkingSlot(data)
    return res.json(parkingSlot)
  } catch (error) {
    handleError(res,error)
  }
};
