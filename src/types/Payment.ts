import { z } from "zod";
import { PaymentSchema } from "../db/zod";

const baseSchema = PaymentSchema

export const insertPaymentParams = baseSchema.omit({
    id:true,
}).extend({
    expenses: z.object({id:z.string()}).array().optional()
})

export const insertGetAllPayments = baseSchema.extend({
    community_id:z.string()
}).pick({
    community_id:true
})

export const insertGetPayment = baseSchema.extend({
    community_id:z.string()
}).pick({
    id:true,
    community_id:true                               
})

export const insertEditPayment = baseSchema.pick({
    description:true,
    isEmailSend:true,
    status:true,
    voucherImage:true,
}).partial().extend({
    id:z.string(),
    community_id: z.string()
})

export type NewPayment = z.infer<typeof insertPaymentParams>
export type GetPayment = z.infer<typeof insertGetPayment>
export type GetAllPayment = z.infer<typeof insertGetAllPayments>
export type EditPayment = z.infer<typeof  insertEditPayment>



