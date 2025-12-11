export interface Payment {
  id: number;
  date: string;
  description: string;
  amount: number;
  paymentTypeId: number;
  receiptPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentType {
  id: number;
  name: string;
}

export interface CreatePaymentDto {
  date: string;
  paymentTypeId: number;
  description: string;
  amount: number;
}