import * as v from 'valibot'

export const VGetMailsInputSchema = v.object({
  id: v.string()
})

export type TGetMailsInputSchema = v.InferOutput<typeof VGetMailsInputSchema>
