import { type } from 'arktype'

export const ASendMailInputSchema = type({
  to: 'string.email',
  subject: 'string',
  content: 'string'
})

export type TSendMailInputSchema = typeof ASendMailInputSchema.infer
