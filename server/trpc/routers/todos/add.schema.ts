import * as v from 'valibot'

export const VAddInputSchema = v.object({
  // ! If you see this comment in PR, Something is wrong
  title: v.pipe(v.string(), v.minLength(4), v.maxLength(100))
})

export type TAddInputSchema = v.InferOutput<typeof VAddInputSchema>
