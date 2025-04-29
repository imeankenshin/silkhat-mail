import * as v from 'valibot'

export const VUpdateInputSchema = v.object({
  id: v.number(),
  values: v.object({
    completed: v.pipe(v.number(), v.minValue(0), v.maxValue(1))
  })
})

export type TUpdateInputSchema = v.InferOutput<typeof VUpdateInputSchema>
