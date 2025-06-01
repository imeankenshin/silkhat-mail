import * as v from 'valibot'

export const VAddInputSchema = v.object({
  title: v.pipe(v.string(), v.maxLength(100))
})

export type TAddInputSchema = v.InferOutput<typeof VAddInputSchema>
