import { type } from 'arktype'

export const AListMailsInputSchema = type({
  'maxResults?': '0 < number <= 100',
  'pageToken?': 'string',
  'q?': 'string' // Gmail search query
})

export type TListMailsInputSchema = typeof AListMailsInputSchema.infer
