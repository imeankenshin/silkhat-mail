import * as v from 'valibot'

export const VTrashMailInputSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1))
})

export type TTrashMailInputSchema = v.InferOutput<typeof VTrashMailInputSchema>
