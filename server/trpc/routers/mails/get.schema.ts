import * as v from 'valibot'

export const VGetMailsInputSchema = v.object({
  maxResults: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  pageToken: v.optional(v.string()),
  q: v.optional(v.string()) // Gmail search query
})

export type TGetMailsInputSchema = v.InferOutput<typeof VGetMailsInputSchema>
