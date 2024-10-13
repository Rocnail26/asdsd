import { Router } from "express";
import { editCommunityController } from "./controller";
import { validateJWT } from "../middleware/validateJWT";
const communityRouter = Router()

communityRouter.route("/:id")
.all(validateJWT)
.put(editCommunityController)



export default communityRouter