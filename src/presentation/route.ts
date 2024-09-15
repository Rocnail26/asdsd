import {Router} from "express"
import authRouter from "./auth/route"
import residenceRouter from "./residence/route"
import residenceTypeRouter from "./residenceType/Route"
import roleRouter from "./role/route"
import userRoute from "./user/route"
import accountRouter from "./account/route"
import providerRouter from "./provider/route"


const mainRouter = Router()


mainRouter.use("/auth", authRouter)
mainRouter.use("/residence", residenceRouter)
mainRouter.use("/residenceType",residenceTypeRouter)
mainRouter.use("/role",roleRouter)
mainRouter.use("/user",userRoute)
mainRouter.use("/account",accountRouter)
mainRouter.use("/provider",providerRouter)

export default mainRouter 