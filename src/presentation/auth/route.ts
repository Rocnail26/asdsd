import {Router} from "express"
import {activateUserController, loginUserController, registerUserController, revalidateTokenController} from "./controller"
import { validateJWT } from "../middleware/validateJWT"


const authRouter = Router()


authRouter.route("/")
.post(registerUserController)
.get(validateJWT,revalidateTokenController)

authRouter.route("/login")
.post(loginUserController)

authRouter.route("/:token")
.put(activateUserController)





export default authRouter