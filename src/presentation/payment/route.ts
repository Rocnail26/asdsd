import  {Router} from "express"
import { createPaymentController, editPaymentController, getAllPaymentsController, getPaymentController } from "./controller"
import { validateJWT } from "../middleware/validateJWT"
const paymentRouter = Router()


paymentRouter.route("/")
.all(validateJWT)
.post(createPaymentController)
.get(getAllPaymentsController)

paymentRouter.route("/:id")
.all(validateJWT)
.put(editPaymentController)
.get(getPaymentController)




export default paymentRouter