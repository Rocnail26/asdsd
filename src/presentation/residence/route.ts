import {Router} from "express"
import { validateJWT } from "../middleware/validateJWT"
import { createResidenceController, getAllRecidencesController,getResidenceController } from "./controller"
const residenceRouter = Router()



residenceRouter.route("/")
.all(validateJWT)
.post(createResidenceController)
.get(getAllRecidencesController)

residenceRouter.route("/:id")
.all(validateJWT)
.get(getResidenceController)



export default residenceRouter