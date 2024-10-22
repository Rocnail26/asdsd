import {Router} from "express"
import { validateJWT } from "../middleware/validateJWT"
import { editUserController, getAlluserController, getUserController } from "./controller"
import { JsonWebTokenError } from "jsonwebtoken"
import { editUser } from "../../services/user/editUser"

const userRoute = Router()


userRoute.route("/")
.all(validateJWT)
.get(getAlluserController)

userRoute.route("/:id")
.all(validateJWT)
.get(getUserController)
.put(editUserController)

export default userRoute