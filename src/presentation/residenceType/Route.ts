import {Router} from "express"
import { validateJWT } from "../middleware/validateJWT"
import { createResidenceTypeController, editResidenceTypeController, getAllResidenceTypeController } from "./controller"

const residenceTypeRouter = Router()

residenceTypeRouter.route("/")
.all(validateJWT)
.post(createResidenceTypeController)
.get(getAllResidenceTypeController)


residenceTypeRouter.route("/:id")
.all(validateJWT)
.put(editResidenceTypeController)



export default residenceTypeRouter