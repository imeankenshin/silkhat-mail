import { TRPCError } from '@trpc/server'
import type { TUpdateInputSchema } from './update.schema'
import type { User } from '~~/types/auth'

type UpdateOptions = {
  ctx: {
    user: User
  }
  input: TUpdateInputSchema
}
export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  const updatedTodo = await useDB().update(tables.todos).set(input.values).where(and(
    eq(tables.todos.id, input.id),
    eq(tables.todos.userId, ctx.user.id)
  )).returning()

  if (!updatedTodo) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Todo not found'
    })
  }
  return updatedTodo[0]
}
