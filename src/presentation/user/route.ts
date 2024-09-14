import {Router} from "express"
import { validateJWT } from "../middleware/validateJWT"
import { getAlluserController, getUserController } from "./controller"
import { JsonWebTokenError } from "jsonwebtoken"

const userRoute = Router()


userRoute.route("/")
.all(validateJWT)
.get(getAlluserController)

userRoute.route("/:id")
.all(validateJWT)
.get(getUserController)


export default userRoute