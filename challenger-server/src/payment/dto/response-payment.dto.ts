export class ResponsePaymentDto {     
  id: number;
  amount: string;
  date: string;
  description: string;
  paymentTypeId: number;
  receiptPath: string | null;
  createdAt: string;
  updatedAt: string;
}