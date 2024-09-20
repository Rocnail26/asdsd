import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import { createCashoutController, editCashoutController, getAllCashoutsController, getCashoutController } from "./controller";
const cashoutRouter = Router()


cashoutRouter.route("/")
.all(validateJWT)
.get(getAllCashoutsController)
.post(createCashoutController)

cashoutRouter.route("/:id")
.all(validateJWT)
.put(editCashoutController)
.get(getCashoutController)


export default cashoutRouter