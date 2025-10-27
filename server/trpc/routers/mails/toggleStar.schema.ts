import { type } from 'arktype'

export const AToggleStarInputSchema = type({
  id: 'string > 0',
  value: 'boolean'
})

export type TToggleStarInputSchema = typeof AToggleStarInputSchema.infer
