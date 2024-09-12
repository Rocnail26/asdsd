import * as z from "zod"
import { CompleteResidenceType, RelatedResidenceTypeModel, CompleteExpense, RelatedExpenseModel } from "./index"

export const ExpenseTypeModel = z.object({
  id: z.number().int(),
  title: z.string(),
  value: z.number().int(),
  residenceType_id: z.number().int(),
})

export interface CompleteExpenseType extends z.infer<typeof ExpenseTypeModel> {
  ResidenceType: CompleteResidenceType
  Expense: CompleteExpense[]
}

/**
 * RelatedExpenseTypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedExpenseTypeModel: z.ZodSchema<CompleteExpenseType> = z.lazy(() => ExpenseTypeModel.extend({
  ResidenceType: RelatedResidenceTypeModel,
  Expense: RelatedExpenseModel.array(),
}))
