import * as v from 'valibot'

export const VDeleteInputSchema = v.object({
  id: v.number()
})

export type TDeleteInputSchema = v.InferOutput<typeof VDeleteInputSchema>
