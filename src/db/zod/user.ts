import * as z from "zod"
import { CompleteCommunity, RelatedCommunityModel, CompleteRole, RelatedRoleModel, CompletePayment, RelatedPaymentModel, CompleteResidence, RelatedResidenceModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string(),
  password: z.string().nullish(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
  community_id: z.string(),
  role_id: z.number().int(),
  residence_id: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  Community: CompleteCommunity
  Role?: CompleteRole | null
  PaymentsCreated: CompletePayment[]
  PaymentsMade: CompletePayment[]
  Residence: CompleteResidence[]
  ResidentIn?: CompleteResidence | null
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  Community: RelatedCommunityModel,
  Role: RelatedRoleModel.nullish(),
  PaymentsCreated: RelatedPaymentModel.array(),
  PaymentsMade: RelatedPaymentModel.array(),
  Residence: RelatedResidenceModel.array(),
  ResidentIn: RelatedResidenceModel.nullish(),
}))
