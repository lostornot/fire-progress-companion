import { z } from "zod";

export const checkinSchema = z.object({
  id: z.string().min(1),
  planId: z.string().min(1),
  checkinDate: z.string().min(1),
  currentNetWorth: z.number().nonnegative(),
  annualSpending: z.number().positive(),
  note: z.string(),
  createdAt: z.string().min(1),
});
