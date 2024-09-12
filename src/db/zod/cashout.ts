import * as z from "zod"
import { CompleteProvider, RelatedProviderModel, CompleteAccount, RelatedAccountModel } from "./index"

export const CashoutModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string(),
  amount: z.number(),
  billImage: z.string(),
  account_id: z.string(),
  status: z.string(),
  registerDate: z.date(),
})

export interface CompleteCashout extends z.infer<typeof CashoutModel> {
  Provider: CompleteProvider
  Account: CompleteAccount
}

/**
 * RelatedCashoutModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCashoutModel: z.ZodSchema<CompleteCashout> = z.lazy(() => CashoutModel.extend({
  Provider: RelatedProviderModel,
  Account: RelatedAccountModel,
}))
