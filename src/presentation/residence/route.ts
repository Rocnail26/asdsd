import {Router} from "express"
import { validateJWT } from "../middleware/validateJWT"
import { createResidenceController, getAllRecidencesController,getExpensesByResidentController,getResidenceController } from "./controller"
const residenceRouter = Router()



residenceRouter.route("/")
.all(validateJWT)
.post(createResidenceController)
.get(getAllRecidencesController)

residenceRouter.route("/:id")
.all(validateJWT)
.get(getResidenceController)

residenceRouter.route("/:id/expense")
.all(validateJWT)
.get(getExpensesByResidentController)



export default residenceRouter