import * as v from 'valibot'

export const VToggleStarInputSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  value: v.boolean()
})

export type TToggleStarInputSchema = v.InferOutput<typeof VToggleStarInputSchema>
