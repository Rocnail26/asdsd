import * as z from "zod"
import { CompleteCommunity, RelatedCommunityModel, CompletePayment, RelatedPaymentModel, CompleteCashout, RelatedCashoutModel } from "./index"

export const AccountModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.bigint(),
})

export interface CompleteAccount extends z.infer<typeof AccountModel> {
  Community: CompleteCommunity
  Payment: CompletePayment[]
  Cashout: CompleteCashout[]
}

/**
 * RelatedAccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAccountModel: z.ZodSchema<CompleteAccount> = z.lazy(() => AccountModel.extend({
  Community: RelatedCommunityModel,
  Payment: RelatedPaymentModel.array(),
  Cashout: RelatedCashoutModel.array(),
}))
