import { type } from 'arktype'

export const ASendDraftInputSchema = type({
  'draftId': 'string',
  'changedValues?': type({
    'to?': 'string.email',
    'subject?': 'string',
    'content?': 'string'
  })
})

export type TSendDraftInputSchema = typeof ASendDraftInputSchema.infer
