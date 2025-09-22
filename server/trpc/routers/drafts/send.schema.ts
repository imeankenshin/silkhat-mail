import * as v from 'valibot'

export const VSendDraftInputSchema = v.pipe(
  v.object({
    draftId: v.string(),
    changedValues: v.optional(v.object({
      to: v.optional(v.pipe(v.string(), v.email())),
      subject: v.optional(v.pipe(v.string())),
      content: v.optional(v.string())
    }))
  })
)

export type TSendDraftInputSchema = v.InferOutput<typeof VSendDraftInputSchema>
