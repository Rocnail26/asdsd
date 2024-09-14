import {Router} from "express"
import authRouter from "./auth/route"
import residenceRouter from "./residence/route"
import residenceTypeRouter from "./residenceType/Route"
import roleRouter from "./role/route"


const mainRouter = Router()


mainRouter.use("/auth", authRouter)
mainRouter.use("/residence", residenceRouter)
mainRouter.use("/residenceType",residenceTypeRouter)
mainRouter.use("/role",roleRouter)


export default mainRouter 