import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import {
  createResidenceController,
  getAllRecidencesController,
  getExpensesByResidentController,
  getPaymentsByResidenceController,
  getResidenceController,
  updateResidenceController,
} from "./controller";
const residenceRouter = Router();

residenceRouter
  .route("/")
  .all(validateJWT)
  .post(createResidenceController)
  .get(getAllRecidencesController);

residenceRouter.route("/:id")
.all(validateJWT)
.get(getResidenceController)
.put(updateResidenceController)

residenceRouter
  .route("/:id/expense")
  .all(validateJWT)
  .get(getExpensesByResidentController);

residenceRouter
  .route("/:id/payment")
  .all(validateJWT)
  .get(getPaymentsByResidenceController);

export default residenceRouter;
