import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import { createParkingSlotController, editParkingSlotController, getAllParkingSlotController, getParkingSlotController } from "./controller";
const parkingSlotRouter = Router()


parkingSlotRouter.route("/")
.all(validateJWT)
.post(createParkingSlotController)
.get(getAllParkingSlotController)


parkingSlotRouter.route("/:id")
.all(validateJWT)
.put(editParkingSlotController)
.get(getParkingSlotController)


export default parkingSlotRouter