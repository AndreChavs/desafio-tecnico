import { z } from 'zod';

export const PaymentSchema = z.object({
  date: z.coerce.date(),
  paymentTypeId: z.number().int(),
  description: z.string(),
  amount: z.number().int(), // numero inteiro
  receiptPath: z.string().optional().nullable(),
});

export const CreateTypePaymentSchema = z.object({
  name: z.string()
})

export const PaymentCreateResponseSchema = PaymentSchema.extend({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});



export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const UpdatePaymentSchema = PaymentSchema.partial();