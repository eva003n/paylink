export type PaymentData = {
    transactionId: string,
    // checkOutRequestId: string,
    phoneNumber: string
    shortCode: number,
    amount: number
}

export type PaymentQuery = {
  transactionId: string;
  shortCode: number,
  checkoutRequestId: string,
  attempts: number
};