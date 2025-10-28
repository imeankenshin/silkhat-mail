import { type } from 'arktype'

export const ACreateDraftInputSchema = type({
  'to?': 'string.email',
  'subject?': 'string',
  'content?': 'string'
})

export type TCreateDraftInputSchema = typeof ACreateDraftInputSchema.infer
