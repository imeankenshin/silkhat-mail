import { eq, and } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'
import { authorize } from '~~/server/utils/auth'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  const session = await authorize(event)

  // List todos for the current user
  const deletedTodo = await useDB().delete(tables.todos).where(and(
    eq(tables.todos.id, id),
    eq(tables.todos.userId, session.user.id)
  )).returning()

  if (!deletedTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }
  return deletedTodo
})
