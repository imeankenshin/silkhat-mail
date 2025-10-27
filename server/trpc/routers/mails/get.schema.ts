import { type } from 'arktype'

export const AGetMailsInputSchema = type({
  id: 'string > 0'
})

export type TGetMailsInputSchema = typeof AGetMailsInputSchema.infer
