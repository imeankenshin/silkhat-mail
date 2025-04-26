import { z } from 'zod'

export const VDeleteInputSchema = z.object({
  id: z.number()
})

export type TDeleteInputSchema = z.infer<typeof VDeleteInputSchema>
