import * as v from 'valibot'

export const VCreateDraftInputSchema = v.object({
  to: v.optional(v.pipe(v.string(), v.email())),
  subject: v.optional(v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(255),
    v.regex(/^[^ \r\n]+$/, 'Subject must not contain newlines')
  )),
  content: v.optional(v.string())
})

export type TCreateDraftInputSchema = v.InferOutput<
  typeof VCreateDraftInputSchema
>
