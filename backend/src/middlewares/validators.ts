import z from "zod"

const MpesaPaymentSTKFailedSchema = z.object({
  Body: {
    stkCallback: {
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
    },
  },
});

const MpesaPaymentSTKSuccessSchema = z.object({
  Body: {
    stkCallback: {
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: {
        Item: [
          {
            Name: z.literal("Amount"),
            Value: z.number(),
          },
          {
            Name: z.literal("MpesaReceiptNumber"),
            Value: z.string(),
          },
          {
            Name: z.literal("TransactionDate"),
            Value: z.number(),
          },
          {
            Name: z.literal("PhoneNumber"),
            Value: z.number(),
          },
        ],
      },
    },
  },
});

const TokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number()
})

export type Token = z.infer<typeof TokenResponseSchema >
export type MpesaSTKFailed = z.infer<typeof MpesaPaymentSTKFailedSchema >
export type MpesaSTKSuccess = z.infer<typeof MpesaPaymentSTKSuccessSchema >