import { TRANSACTION_TYPE } from '@/constants/transaction.constant';
import z from 'zod';

export const transactionFormSchema = z.object({
  type: z.enum([TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME]),
  payee: z.string().min(1),
  date: z.date(),
  categoryId: z.uuid(),
  amount: z
    .string()
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/)
    .refine(value => +value)
});
