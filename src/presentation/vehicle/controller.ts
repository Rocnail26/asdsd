import { Request, Response } from "express";
import { isAdmin } from "../../services/user";
import { insertEditVehicle, insertGetAllVehicles, insertGetVehicle, insertVehicleParams } from "../../types/Vehicle";
import { createVehicle } from "../../services/Vehicle/createVehicle";
import { handleError } from "../../utils/handleError";
import { getVehicle } from "../../services/Vehicle/getVehicle";
import { getAllVehicles } from "../../services/Vehicle/getAllVehicles";
import { editVehicle } from "../../services/Vehicle/editVehicle";

export const createVehicleController = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.body.user;
      const body = req.body;
      const admin = await isAdmin(id);
      if (!admin) return res.status(403).json("invalid admin");
      const { data, error } = await insertVehicleParams.safeParseAsync({
        ...body,
      });
  
      if (error)
        return res.status(400).json({ error: error.flatten().fieldErrors });
  
      const vehicle = await createVehicle(data);
  
      return res.status(201).json(vehicle);
    } catch (error) {
      handleError(res, error);
    }
  };
  
export const getVehicleController = async (req: Request, res: Response) => {
    try {
      const { id, community_id } = req.body.user;
      const params = req.params;
      const admin = await isAdmin(id);
      if (!admin) return res.status(403).json("invalid admin");
      const { data, error } = await insertGetVehicle.safeParseAsync({
        ...params,
        community_id,
      });
  
      if (error)
        return res.status(400).json({ error: error.flatten().fieldErrors });
  
      const vehicle = await getVehicle(data);
      if (!vehicle) return res.status(404).json({error:"vehiculo no encontrado"});
  
      return res.json(vehicle);
    } catch (error) {
      handleError(res, error);
    }
  };
  
export const getAllVehiclesController = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id, community_id } = req.body.user;
      const admin = await isAdmin(id);
      if (!admin) return res.status(403).json("invalid admin");
      const { data, error } = await insertGetAllVehicles.safeParseAsync({
        community_id,
      });
      if (error)
        return res.status(400).json({ error: error.flatten().fieldErrors });
      const vehicles = await getAllVehicles(data);
      return res.json(vehicles);
    } catch (error) {
      handleError(res, error);
    }
  };
  
  export const editVehicleController = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id, community_id } = req.body.user;
      const body = req.body;
      const params = req.params;
      const admin = await isAdmin(id);
      if (!admin) return res.status(403).json("invalid admin");
      const { data, error } = await insertEditVehicle.safeParseAsync({
        ...body,
        ...params,
        community_id,
      });
  
      if (error)
        return res.status(400).json({ error: error.flatten().fieldErrors });
  
      const vehicle = await editVehicle(data)
      return res.json(vehicle)
    } catch (error) {
      handleError(res,error)
    }
  };
  