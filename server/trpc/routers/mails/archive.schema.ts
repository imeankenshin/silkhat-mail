import * as v from 'valibot'

export const VArchiveMailInputSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1))
})

export type TArchiveMailInputSchema = v.InferOutput<typeof VArchiveMailInputSchema>
