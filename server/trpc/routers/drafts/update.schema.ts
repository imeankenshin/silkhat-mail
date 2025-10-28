import { type } from 'arktype'

export const AUpdateDraftInputSchema = type({
  'draftId': 'string',
  'to?': 'string.email',
  'subject?': 'string',
  'content?': 'string'
})

export type TUpdateDraftInputSchema = typeof AUpdateDraftInputSchema.infer
