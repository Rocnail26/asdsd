import {Router} from "express"
import { validateJWT } from "../middleware/validateJWT"
import { createProviderController, editProviderController, getAllProvidersController, getProviderController } from "./controller"
const providerRouter = Router()


providerRouter.route("/")
.all(validateJWT)
.post(createProviderController)
.get(getAllProvidersController)


providerRouter.route("/:id")
.all(validateJWT)
.get(getProviderController)
.put(editProviderController)


export default providerRouter