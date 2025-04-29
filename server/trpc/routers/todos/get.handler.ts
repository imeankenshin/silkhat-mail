import type { User } from '~~/types/auth'

type GetOptions = {
  ctx: {
    user: User
  }
}
export const getHandler = async ({ ctx }: GetOptions) => {
  const todos = await useDB().select().from(tables.todos).where(eq(tables.todos.userId, ctx.user.id))
  return todos as Todo[]
}
