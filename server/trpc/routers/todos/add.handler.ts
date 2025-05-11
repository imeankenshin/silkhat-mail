import type { TAddInputSchema } from './add.schema'
import type { Todo } from '~~/server/utils/db'
import type { User } from '~~/types/auth'

type AddOptions = {
  ctx: {
    user: User
  }
  input: TAddInputSchema
}
export const addHandler = async ({ ctx, input }: AddOptions) => {
  const todos = await useDB().insert(tables.todos).values({
    userId: ctx.user.id,
    title: input.title,
    completed: 0,
    createdAt: new Date()
  }).returning()
  return todos[0]! as Todo
}
