import { z } from 'zod';

export const CreatePaymentTypeSchema = z.object({
  name: z.string()
});