export type TPayment = {
  subscription_user_id: string;
  stripe_payment_intent_id: string;
  stripe_invoice_id: string;
  amount_in_decimal: number;
  refunded_at: string;
  paid_at: string;
}

export type TPaymentInsert = Omit<TPayment, 'refunded_at' | 'paid_at'> & {
  refunded_at: Date;
  paid_at: Date;
}