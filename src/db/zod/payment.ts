import * as z from "zod"
import { CompleteExpense, RelatedExpenseModel, CompleteUser, RelatedUserModel, CompleteAccount, RelatedAccountModel } from "./index"

export const PaymentModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  registerDate: z.date(),
  amount: z.number(),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string(),
})

export interface CompletePayment extends z.infer<typeof PaymentModel> {
  Expense: CompleteExpense[]
  User: CompleteUser
  Account: CompleteAccount
  Admin: CompleteUser
}

/**
 * RelatedPaymentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPaymentModel: z.ZodSchema<CompletePayment> = z.lazy(() => PaymentModel.extend({
  Expense: RelatedExpenseModel.array(),
  User: RelatedUserModel,
  Account: RelatedAccountModel,
  Admin: RelatedUserModel,
}))
