import * as v from 'valibot'

export const VUpdateDraftInputSchema = v.pipe(
  v.object({
    draftId: v.string(),
    to: v.optional(v.pipe(v.string(), v.email())),
    subject: v.optional(v.string()),
    content: v.optional(v.string())
  })
)

export type TUpdateDraftInputSchema = v.InferOutput<
  typeof VUpdateDraftInputSchema
>
