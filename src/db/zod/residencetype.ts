import * as z from "zod"
import { CompleteResidence, RelatedResidenceModel, CompleteExpenseType, RelatedExpenseTypeModel, CompleteCommunity, RelatedCommunityModel } from "./index"

export const ResidenceTypeModel = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  community_id: z.string(),
})

export interface CompleteResidenceType extends z.infer<typeof ResidenceTypeModel> {
  Residence: CompleteResidence[]
  ExpenseType: CompleteExpenseType[]
  Community: CompleteCommunity
}

/**
 * RelatedResidenceTypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedResidenceTypeModel: z.ZodSchema<CompleteResidenceType> = z.lazy(() => ResidenceTypeModel.extend({
  Residence: RelatedResidenceModel.array(),
  ExpenseType: RelatedExpenseTypeModel.array(),
  Community: RelatedCommunityModel,
}))
