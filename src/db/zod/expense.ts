import * as z from "zod"
import { CompleteResidence, RelatedResidenceModel, CompleteExpenseType, RelatedExpenseTypeModel, CompletePayment, RelatedPaymentModel } from "./index"

export const ExpenseModel = z.object({
  id: z.string(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.date(),
  expireDate: z.date(),
  status: z.string(),
  expenseType_id: z.number().int(),
  payment_id: z.string(),
})

export interface CompleteExpense extends z.infer<typeof ExpenseModel> {
  Residence: CompleteResidence
  ExpenseType: CompleteExpenseType
  Payment: CompletePayment
}

/**
 * RelatedExpenseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedExpenseModel: z.ZodSchema<CompleteExpense> = z.lazy(() => ExpenseModel.extend({
  Residence: RelatedResidenceModel,
  ExpenseType: RelatedExpenseTypeModel,
  Payment: RelatedPaymentModel,
}))
