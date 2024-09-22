import { z } from "zod";
import { TZDate } from "@date-fns/tz";

export const PaginationSchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10)
})


const stringToDateTz =  z.string().transform((str) => {
    const date = new TZDate(str,"America/Caracas");
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date;
  });

export const FilterDateSchema = z.object({
    from: stringToDateTz.optional(),
    to: stringToDateTz.optional()
})

