import { z } from "zod";
import { PaymentSchema } from "../db/zod";

const baseSchema = PaymentSchema

const insertPaymentParams = baseSchema.omit({
    id:true,
}).extend({
    expense: z.object({id:z.string()}).array()
})

export type NewPayment = z.infer<typeof insertPaymentParams>



