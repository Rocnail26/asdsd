import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteCommunity, RelatedCommunityModel, CompleteResidenceType, RelatedResidenceTypeModel, CompleteParkingSlot, RelatedParkingSlotModel, CompleteExpense, RelatedExpenseModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const ResidenceModel = z.object({
  id: z.string(),
  title: z.string(),
  owner_id: z.string().nullish(),
  community_id: z.string(),
  contacts: jsonSchema,
  residenceType_id: z.number().int(),
})

export interface CompleteResidence extends z.infer<typeof ResidenceModel> {
  Owner?: CompleteUser | null
  Community: CompleteCommunity
  ResidenceType: CompleteResidenceType
  ParkingSlot: CompleteParkingSlot[]
  Expense: CompleteExpense[]
  Resident: CompleteUser[]
}

/**
 * RelatedResidenceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedResidenceModel: z.ZodSchema<CompleteResidence> = z.lazy(() => ResidenceModel.extend({
  Owner: RelatedUserModel.nullish(),
  Community: RelatedCommunityModel,
  ResidenceType: RelatedResidenceTypeModel,
  ParkingSlot: RelatedParkingSlotModel.array(),
  Expense: RelatedExpenseModel.array(),
  Resident: RelatedUserModel.array(),
}))
