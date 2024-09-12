import * as z from "zod"
import { CompleteCommunity, RelatedCommunityModel, CompleteCashout, RelatedCashoutModel } from "./index"

export const ProviderModel = z.object({
  id: z.string(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  website: z.string().nullish(),
  active: z.boolean(),
  community_id: z.string(),
})

export interface CompleteProvider extends z.infer<typeof ProviderModel> {
  Community: CompleteCommunity
  Cashout: CompleteCashout[]
}

/**
 * RelatedProviderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProviderModel: z.ZodSchema<CompleteProvider> = z.lazy(() => ProviderModel.extend({
  Community: RelatedCommunityModel,
  Cashout: RelatedCashoutModel.array(),
}))
