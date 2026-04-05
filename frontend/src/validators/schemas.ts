import z from "zod"

export const apiReponseData = z.object()
export const apiResponseSuccessSchema = z.object({
    data: z.object(apiReponseData),
    message: z.string() 
})

export const analyticsDatsResponse = z.object({
  stats: z.object({
    totalCollected: z.number(),
    activeLinke: z.number(),
    paidLinke: z.number(),
    pendingPayments: z.number(),
  }),
  links: z.object({
    
  })
});