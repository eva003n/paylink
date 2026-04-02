import z from "zod";
import { UserRoles } from "../../backend/src/models/index";

export const signUpSchema = z.object({
  // username: z.string().min(4).max(64).optional(),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export const merchantSignUPSchema = signUpSchema.extend({
  businessName: z.string().min(5).max(100),
  phoneNumber: z.string().startsWith("254").min(12).max(12).optional(),
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

export const itemSchema = z.object({
  Name: z.string(),
  Value: z.union([z.string(), z.number()]),
});

const MpesaPaymentSTKSuccessSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z.object({
        Item: z.array(itemSchema),
      }),
    }),
  }),
});

const mpesaSTKQueryResultSchema = z.object({
  // data: z.object({
  ResponseCode: z.number(),
  ResponseDescription: z.string(),
  MerchantRequestID: z.string(),
  CheckoutRequestID: z.string(),
  ResultCode: z.number(),
  ResultDesc: z.string(),
  // }),
});

const mpesaSTKQueryRequest = z.object({
  BusinessShortCode: z.number(),
  Password: z.string(),
  Timestamp: z.string(),
  CheckoutRequestID: z.string(),
});

const mpesaSTKPushResponseSchema = z.object({
  // data: z.object({
  MerchantRequestID: z.string(),
  CheckoutRequestID: z.string(),
  ResponseCode: z.number(),
  // }),
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
  token: z.string(),
  email: z.email(),
  phoneNumber: z.string().min(12).max(12),
});
export type SignUpAuth = z.infer<typeof signUpSchema>;
export type MerchantSignUpAuth = z.infer<typeof merchantSignUPSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type Token = z.infer<typeof TokenResponseSchema>;
export type JWT_Token = z.infer<typeof jwtSchema>;
export type MpesaSTKFailed = z.infer<typeof MpesaPaymentSTKFailedSchema>;
export type MpesaSTKSuccess = z.infer<typeof MpesaPaymentSTKSuccessSchema>;
export type PaymentLink = z.infer<typeof paymentLinkSchema>;
export type PaymentSTK = z.infer<typeof paymentSTKSchema>;
export type PaymentSTKQueryRequest = z.infer<typeof mpesaSTKQueryRequest>;
export type PaymentSTKQueryResponse = z.infer<typeof mpesaSTKQueryResultSchema>;
export type PaymentSTKResponse = z.infer<typeof mpesaSTKPushResponseSchema>;
// export type PaymentItem = z.infer<typeof itemSchema>
