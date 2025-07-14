import * as v from 'valibot'

export const VTrashMailInputSchema = v.object({
  id: v.string()
})

export type TTrashMailInputSchema = v.InferOutput<typeof VTrashMailInputSchema>
