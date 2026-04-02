import z from "zod"

export const apiReponseData = z.object()
export const apiResponseSuccessSchema = z.object({
    data: z.object(apiReponseData),
    message: z.string() 
})