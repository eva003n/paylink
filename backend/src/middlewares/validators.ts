import z from "zod"

export const signUpSchema = z.object({
  username: z.string().min(4).max(64),
  email: z.email(),
  password: z.string().min(8).max(72)
})
export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72)
})

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

const paymentLinkSchema = z.object({
  invoiceNo: z.string(),
  merchant_id: z.string(),
  expiresAt: z.string()
})
export type SignUpAuth = z.infer<typeof signUpSchema> 
export type SignInAuth = z.infer<typeof signInSchema> 
export type Token = z.infer<typeof TokenResponseSchema >
export type MpesaSTKFailed = z.infer<typeof MpesaPaymentSTKFailedSchema >
export type MpesaSTKSuccess = z.infer<typeof MpesaPaymentSTKSuccessSchema >
export type PaymentLink = z.infer<typeof paymentLinkSchema>