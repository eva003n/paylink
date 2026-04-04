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

export const paymentLinkSchema = z.object({
  invoiceNo: z.string().optional(),
  merchant_id: z.string().optional(),
  // amount: z.string().transform(Number).pipe(z.number()),
  amount: z.number(),
  shortCode: z.number(),
  expiresAt: z.string().optional(),
});


export type SignUpAuth = z.infer<typeof signUpSchema>;
export type MerchantSignUpAuth = z.infer<typeof merchantSignUPSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;


export type PaymentLink = z.infer<typeof paymentLinkSchema>;

// export type PaymentItem = z.infer<typeof itemSchema>
