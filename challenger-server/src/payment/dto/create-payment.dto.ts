import { z } from 'zod';
import { PaymentSchema, IdParamSchema, PaymentCreateResponseSchema } from '../schema/payment.schema';
import { CreatePaymentTypeSchema } from '../schema/payment-type.schema';
import { ApiProperty } from '@nestjs/swagger';

export type CreatePaymentDto = z.infer<typeof PaymentSchema>;
export type CreatePaymentRes = z.infer<typeof PaymentCreateResponseSchema>[];
export type CreatePaymentTypeDto = z.infer<typeof CreatePaymentTypeSchema>;

// Definimos o tipo TypeScript inferido a partir do schema
export type IdParamDto = z.infer<typeof IdParamSchema>;



/////////////SWAGGER//////////////////
export class CreatePaymentSwaggerDto {
  @ApiProperty({ example: '2025-01-20' })
  date: string;

  @ApiProperty({ example: 1 })
  paymentTypeId: number;

  @ApiProperty({ example: 'Pagamento de folha - janeiro/2025' })
  description: string;

  @ApiProperty({ example: 15000.5 })
  amount: number;
}

export class UpdatePaymentSwaggerDto {
  @ApiProperty({ example: '2025-01-20' })
  date: string;

  @ApiProperty({ example: 1 })
  paymentTypeId: number;

  @ApiProperty({ example: 'Pagamento de folha - janeiro/2025' })
  description: string;

  @ApiProperty({ example: 15000.5 })
  amount: number;
}

export class PaymentResSwagger {
  @ApiProperty({ example: 42 })
  id: number;

  @ApiProperty({ example: '2025-01-31' })
  date: string;

  @ApiProperty({ example: 'Pagamento de hospedagem' })
  description: string;

  @ApiProperty({ example: 199.90 })
  amount: number;

  @ApiProperty({ example: '/uploads/receipts/1738262812-abc.png', required: false })
  receiptPath?: string;

  @ApiProperty({ example: 1 })
  paymentTypeId: number;

  @ApiProperty({ example: '2025-01-31T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-31T12:00:00.000Z' })
  updatedAt: Date;
}

export class PaymentTypeResSwagger {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Hospedagem', description: 'Nome do tipo de pagamento' })
  name: string;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T12:00:00.000Z' })
  updatedAt: Date;
}

export class CreatePaymentTypeSchemaSwagger {
  @ApiProperty({ example: 'card' })
  name: string;
}

export class IdParamType {
  @ApiProperty({example: 96594962654})
  id: number;
}