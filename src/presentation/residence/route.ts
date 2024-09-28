import { Router } from "express";
import { validateJWT } from "../middleware/validateJWT";
import {
  createResidenceController,
  getAllRecidencesController,
  getExpensesByResidentController,
  getPaymentsByResidenceController,
  getResidenceController,
} from "./controller";
const residenceRouter = Router();

residenceRouter
  .route("/")
  .all(validateJWT)
  .post(createResidenceController)
  .get(getAllRecidencesController);

residenceRouter.route("/:id").all(validateJWT).get(getResidenceController);

residenceRouter
  .route("/:id/expense")
  .all(validateJWT)
  .get(getExpensesByResidentController);

residenceRouter
  .route("/:id/payment")
  .all(validateJWT)
  .get(getPaymentsByResidenceController);

export default residenceRouter;
