import * as z from "zod"
import { CompleteResidence, RelatedResidenceModel, CompleteProvider, RelatedProviderModel, CompleteUser, RelatedUserModel, CompleteAccount, RelatedAccountModel, CompleteResidenceType, RelatedResidenceTypeModel } from "./index"

export const CommunityModel = z.object({
  id: z.string(),
  title: z.string(),
  address: z.string(),
})

export interface CompleteCommunity extends z.infer<typeof CommunityModel> {
  Residence: CompleteResidence[]
  Provider: CompleteProvider[]
  User: CompleteUser[]
  Account: CompleteAccount[]
  ResidenceType: CompleteResidenceType[]
}

/**
 * RelatedCommunityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommunityModel: z.ZodSchema<CompleteCommunity> = z.lazy(() => CommunityModel.extend({
  Residence: RelatedResidenceModel.array(),
  Provider: RelatedProviderModel.array(),
  User: RelatedUserModel.array(),
  Account: RelatedAccountModel.array(),
  ResidenceType: RelatedResidenceTypeModel.array(),
}))
