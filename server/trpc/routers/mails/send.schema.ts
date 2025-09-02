import * as v from 'valibot'

export const VSendMailInputSchema = v.object({
  to: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email()),
  subject: v.string(),
  content: v.string()
})

export type TSendMailInputSchema = v.InferOutput<typeof VSendMailInputSchema>
