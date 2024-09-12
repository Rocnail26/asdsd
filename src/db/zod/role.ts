import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const RoleModel = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  modules: z.string(),
})

export interface CompleteRole extends z.infer<typeof RoleModel> {
  User: CompleteUser[]
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() => RoleModel.extend({
  User: RelatedUserModel.array(),
}))
