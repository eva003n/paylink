import {
  linkStatusSchema,
  paymentLinkSchema,
} from "@shared/schemas/validators";
import z from "zod";

export const apiReponseData = z.object();
export const apiResponseSuccessSchema = z.object({
  data: z.object(apiReponseData),
  message: z.string(),
});

export const analyticsDatsResponse = z.object({
  data: z.object({
    stats: z.object({
      totalCollectedPay: z.number(),
      totalCompletedPay: z.number(),
      activeLinks: z.number(),
      totalLinks: z.number(),
      paidLinks: z.number(),
      pendingPayments: z.number(),
      failedPayments: z.number(),
    }),
    recentTransactions: z.array(z.object()),
    links: z.object(),
  }),
});

export const linksResponseSchema = z.object({
  data: z.object({
    links: z.array(
      paymentLinkSchema.extend({
        id: z.string(),
        merchant_id: z.string(),
        status: linkStatusSchema,
        url: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        business_name: z.string().optional(),
        client_name: z.string().optional(),
        reference: z.string().optional(),
        description: z.string().optional(),
        due_date: z.date().optional(),
        total_transactions: z.number().optional(),
        paid_count: z.number().optional(),
        created_at: z.date().optional(),
      }),
    ),
    currentPage: z.number(),
    totalPages: z.number(),
    totalItems: z.number(),
  }),
});
export const createLinkResponseSchema = z.object({
  data: paymentLinkSchema.extend({
    id: z.string(),
    merchant_id: z.string(),
    status: linkStatusSchema,
    url: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    businessName: z.string(),
    // client_name: z.string().optional(),
    // mpesaRef: z.string(),
    
    expiresAt: z.date().optional(),
    total_transactions: z.number().optional(),
    paid_count: z.number().optional(),
    created_at: z.date().optional(),
  }),
});

export const paymentSTKSchema = z.object({
  token: z.string(),
  email: z.email(),
  phoneNumber: z
    .string("Invalid phone number provided")
    .startsWith("7", "Must start with 7")
    .min(9, "Must be at least 9 characters long")
    .max(9, "Cannot exceed 9 characters in long"),
});

export type PaymentSTK = z.infer<typeof paymentSTKSchema>;

export type LinkType = z.infer<typeof createLinkResponseSchema>["data"];
export type AnalyticsApiResponse = z.infer<typeof analyticsDatsResponse>;
export type LinksApiResponse = z.infer<typeof linksResponseSchema>;
// export type LinkType = z.infer<typeof createLinkResponseSchema>
