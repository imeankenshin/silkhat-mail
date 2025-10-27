import { type } from 'arktype'

export const ATrashMailInputSchema = type({
  id: 'string > 0'
})

export type TTrashMailInputSchema = typeof ATrashMailInputSchema.infer
