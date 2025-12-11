import { z } from 'zod';
import { UpdatePaymentSchema } from '../schema/payment.schema';

export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema>;