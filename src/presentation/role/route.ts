import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import { getAllRolesController } from "./controller";

const roleRouter = Router()


roleRouter.route("/")
.all(validateJWT)
.get(getAllRolesController)


export default roleRouter