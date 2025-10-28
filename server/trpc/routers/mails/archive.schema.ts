import { type } from 'arktype'

export const AArchiveMailInputSchema = type({
  id: 'string > 0'
})

export type TArchiveMailInputSchema = typeof AArchiveMailInputSchema.infer
