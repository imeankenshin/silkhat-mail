import * as v from 'valibot'

export const VCreateDraftInputSchema = v.object({
  to: v.optional(v.pipe(v.string(), v.email())),
  subject: v.optional(v.string()),
  content: v.optional(v.string())
})

export type TCreateDraftInputSchema = v.InferOutput<
  typeof VCreateDraftInputSchema
>
