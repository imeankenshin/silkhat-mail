import { z } from 'zod'

export const VAddInputSchema = z.object({
  title: z.string().min(1).max(100)
})

export type TAddInputSchema = z.infer<typeof VAddInputSchema>
