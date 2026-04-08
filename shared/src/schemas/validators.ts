import z from "zod";

export const signUpSchema = z.object({
  // username: z.string().min(4).max(64).optional(),
  email: z.email("Invalid email provided"),
  password: z.string().min(8, "Must be at least 8 characters long").max(72, "Cannot exceed 72 characters long").regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "At least 1 uppercase,1 lowercase,1 number, 1 special character"
    ),
});

export const merchantSignUPSchema = signUpSchema.extend({
  id: z.string().optional(),
  businessName: z
    .string("Invalid business name provided")
    .min(5, "Must be at least 5 characters long")
    .max(100, "Cannot exceed 100 characters long"),
  phoneNumber: z
    .string("Invalid phone number provided")
    .startsWith("2547", "Must start with 2547")
    .min(12, "Must be at least 12 characters long")
    .max(12, "Cannot exceed 12 characters in long")
    .optional(),
});
export const signInSchema = signUpSchema.extend({});

export const linkStatusSchema = z.enum([
  "Active",
   "Paid",
   "Expired",
   "Cancelled",
]);

export const paymentStatusSchema = z.enum([
  "Pending",
  "Completed",
  "Failed",
]);
export const paymentLinkSchema = z.object({
  amount: z.coerce.number(),
  shortCode: z.coerce.number(),
  // status: linkStatusSchema,
  expiresAt: z.string().optional(),
});

export const configEnvSchema = z.enum(["Sandbox", "Production"]);

export const merchantConfigSchema = z.object({
  env: configEnvSchema,
  consumerKey: z.string().min(1, "Consumer key is required"),
  consumerSecret: z.string().min(1, "Consumer secret is required"),
  shortCode: z.string().min(1, "Short code is required"),
  passKey: z.string().min(1, "Pass key is required"),
  callbackUrl: z.string().url("Invalid callback URL"),
});

export const merchantConfigUpdateSchema = merchantConfigSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one configuration field is required",
  });

export const transactionSchema = z.object({
  id: z.string(),
  status: paymentStatusSchema,
  businessName: z.string(),
  clientName: z.string(),
  phoneNumber: z.string(),
  amount: z.string(),
  mpesaRef: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


const filterOptionSchema = z.object({
  page: z.number().min(1, "Page must be at least 1"),
  limit: z.number().min(10, "Limit must be at least 10"),
});


export type TX = z.infer<typeof transactionSchema>;
export type PaymentLinkInput = z.input<typeof paymentLinkSchema>;
export type MerchantConfigInput = z.infer<typeof merchantConfigSchema>;
export type MerchantConfigUpdateInput = z.infer<typeof merchantConfigUpdateSchema>;


export type SignUpAuth = z.infer<typeof signUpSchema>;
export type MerchantSignUpAuth = z.infer<typeof merchantSignUPSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;


export type PaymentLink = z.infer<typeof paymentLinkSchema>;
export type FilterOption = z.infer<typeof filterOptionSchema>
export type LinkStatus = z.infer<typeof linkStatusSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
export type ConfigEnv = z.infer<typeof configEnvSchema>
