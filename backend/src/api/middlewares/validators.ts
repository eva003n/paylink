import z from "zod";
import { UserRoles } from "../../models/index";

export const signUpSchema = z.object({
  username: z.string().min(4).max(64),
  email: z.email(),
  password: z.string().min(8).max(72),
});
export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export const jwtSchema = z.object({
  id: z.string(),
  role: z.enum([...Object.values(UserRoles)]),
});

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

const mpesaSTKQueryResultSchema = z.object({
  data: z.object({
    ResponseCode: z.number(),
    ResponseDescription: z.string(),
    MerchantRequestID: z.string(),
    CheckoutRequestID: z.string(),
    ResultCode: z.number(),
    ResultDesc: z.string(),
  }),
});

const mpesaSTKQueryRequest = z.object({
  BusinessShortCode: z.number(),
  Password: z.string(),
  Timestamp: z.string(),
  CheckoutRequestID: z.string(),
});

const mpesaSTKPushResponseSchema = z.object({
  data: z.object({
    MerchantRequestID: z.string(),
    CheckoutRequestID: z.string(),
    ResponseCode: z.number(),
  }),
});
const TokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
});

export const paymentLinkSchema = z.object({
  invoiceNo: z.string().optional(),
  merchant_id: z.string().optional(),
  // amount: z.string().transform(Number).pipe(z.number()),
  amount: z.number(),
  shortCode: z.number(),
  expiresAt: z.string().optional(),
});

export const paymentSTKSchema = z.object({
  id: z.string(),
  phoneNumber: z.string().min(12).max(12),
});
export type SignUpAuth = z.infer<typeof signUpSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type Token = z.infer<typeof TokenResponseSchema>;
export type JWT_Token = z.infer<typeof jwtSchema>;
export type MpesaSTKFailed = z.infer<typeof MpesaPaymentSTKFailedSchema>;
export type MpesaSTKSuccess = z.infer<typeof MpesaPaymentSTKSuccessSchema>;
export type PaymentLink = z.infer<typeof paymentLinkSchema>;
export type PaymentSTK = z.infer<typeof paymentSTKSchema>;
export type PaymentSTKQueryRequest = z.infer<typeof mpesaSTKQueryRequest>
export type PaymentSTKQueryResponse = z.infer<typeof mpesaSTKQueryResultSchema>
export type PaymentSTKResponse = z.infer<typeof mpesaSTKPushResponseSchema>