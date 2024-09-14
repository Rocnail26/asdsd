import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import { createAccountController, editAccountController, getAccountController, getAllAccountsController } from "./controller";
const accountRouter = Router()

accountRouter.route("/")
.all(validateJWT)
.post(createAccountController)
.get(getAllAccountsController)

accountRouter.route("/:id")
.all(validateJWT)
.get(getAccountController)
.put(editAccountController)
 
export default accountRouter