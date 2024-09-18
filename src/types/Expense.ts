import { z } from "zod";
import { ExpenseSchema } from "../db/zod";
import { Prisma } from "@prisma/client";

const baseSchema = ExpenseSchema;

export const insertExpenseParams = baseSchema
  .omit({
    id: true,
  })
  .extend({
    emitingDate: z.coerce.date().optional(),
    dayPayment: z.coerce.date().optional(),
    value: z.number().transform((value) => new Prisma.Decimal(value)),
    owedValue:  z.number().transform((value) => new Prisma.Decimal(value)),
    payment_id: z.string().optional()
  })
  .refine(
    ({ emitingDate, isRecurrent, dayPayment }) => {
      if (!emitingDate && !dayPayment) return false;
      if (isRecurrent && !dayPayment) return false;
      if (isRecurrent && emitingDate) return false;
      return true;
    },
    {
      message:
        "emitingDate, dayPayment y isCurrent no estan siendo correctamente utilizados",
    }
  ).refine(({owedValue,value}) => owedValue.toString == value.toString , {message:"owedValue y value no son iguales",path: ["owedValue"]} );

export const insertGetAllExpenses = baseSchema.extend({
  community_id: z.string()
}).pick({community_id:true})

export const insertGetExpense = baseSchema.extend({
  community_id: z.string()
}).pick({
  id: true,
  community_id:true
});

export const insertEditExpense = baseSchema.omit({
  value: true,
  owedValue: true,
  payment_id: true,
  residence_id:true
}).extend({
  community_id: z.string(),
  emitingDate: z.coerce.date().optional(),
    dayPayment: z.coerce.date().optional(),
});

export type NewExpense = z.infer<typeof insertExpenseParams>;
export type GetAllExpenses = z.infer<typeof insertGetAllExpenses>;
export type GetExpense = z.infer<typeof insertGetExpense>;
export type EditExpense = z.infer<typeof insertEditExpense>;
