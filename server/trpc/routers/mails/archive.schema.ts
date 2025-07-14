import * as v from 'valibot'

export const VArchiveMailInputSchema = v.object({
  id: v.string()
})

export type TArchiveMailInputSchema = v.InferOutput<typeof VArchiveMailInputSchema>
