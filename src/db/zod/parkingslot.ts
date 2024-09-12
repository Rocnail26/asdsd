import * as z from "zod"
import { CompleteResidence, RelatedResidenceModel } from "./index"

export const ParkingSlotModel = z.object({
  id: z.string(),
  number: z.number().int(),
  residence_id: z.string(),
})

export interface CompleteParkingSlot extends z.infer<typeof ParkingSlotModel> {
  Residence: CompleteResidence
}

/**
 * RelatedParkingSlotModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedParkingSlotModel: z.ZodSchema<CompleteParkingSlot> = z.lazy(() => ParkingSlotModel.extend({
  Residence: RelatedResidenceModel,
}))
