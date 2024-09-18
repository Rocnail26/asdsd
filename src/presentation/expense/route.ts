import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import { createExpenseController, editExpenseController, getAllExpensesController, getExpenseController } from "./controller";
const expenseRouter = Router()


expenseRouter.route("/")
.all(validateJWT)
.get(getAllExpensesController)
.post(createExpenseController)

expenseRouter.route("/:id")
.all(validateJWT)
.get(getExpenseController)
.put(editExpenseController)


export default expenseRouter