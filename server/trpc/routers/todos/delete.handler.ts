import { TRPCError } from '@trpc/server'
import type { TDeleteInputSchema } from './delete.schema'
import type { User } from '~~/types/auth'

type DeleteOptions = {
  ctx: {
    user: User
  }
  input: TDeleteInputSchema
}

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  const deletedTodo = await useDB().delete(tables.todos).where(and(
    eq(tables.todos.id, input.id),
    eq(tables.todos.userId, ctx.user.id)
  )).returning()

  if (!deletedTodo) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Todo not found'
    })
  }
  return deletedTodo[0]
}
