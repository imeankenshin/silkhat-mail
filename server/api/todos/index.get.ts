import { eq } from 'drizzle-orm'
import { authorize } from '~~/server/utils/auth'

export default eventHandler(async (event) => {
  const { user } = await authorize(event)

  // List todos for the current user
  const todos = await useDB().select().from(tables.todos).where(eq(tables.todos.userId, user.id))

  return todos as Todo[]
})
