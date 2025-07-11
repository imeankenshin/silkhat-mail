import * as v from 'valibot'

export const VToggleStarInputSchema = v.object({
  id: v.string()
})

export type TToggleStarInputSchema = v.InferOutput<typeof VToggleStarInputSchema>
