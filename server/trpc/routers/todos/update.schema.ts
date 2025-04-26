import { z } from 'zod'

export const VUpdateInputSchema = z.object({
  id: z.number(),
  values: z.object({
    completed: z.number().min(0).max(1)
  })
})

export type TUpdateInputSchema = z.infer<typeof VUpdateInputSchema>
