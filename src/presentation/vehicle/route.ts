import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import { createVehicleController, editVehicleController, getAllVehiclesController, getVehicleController } from "./controller";

const vehicleRouter = Router()



vehicleRouter.route("/")
.all(validateJWT)
.get(getAllVehiclesController)
.post(createVehicleController)



vehicleRouter.route("/:id")
.all(validateJWT)
.get(getVehicleController)
.put(editVehicleController)


export default vehicleRouter