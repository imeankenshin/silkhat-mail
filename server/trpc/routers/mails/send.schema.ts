import * as v from 'valibot'

export const VSendMailInputSchema = v.object({
  to: v.string(),
  subject: v.string(),
  content: v.string()
})

export type TSendMailInputSchema = v.InferOutput<typeof VSendMailInputSchema>
