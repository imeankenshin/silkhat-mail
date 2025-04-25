import { useValidatedBody, z } from 'h3-zod'
import { authorize } from '~~/server/utils/auth'

export default eventHandler(async (event) => {
  const { title } = await useValidatedBody(event, {
    title: z.string().min(1).max(100)
  })
  const { user } = await authorize(event)

  // Insert todo for the current user
  const todo = await useDB().insert(tables.todos).values({
    userId: user.id,
    title,
    completed: 0,
    createdAt: new Date()
  }).returning({
    id: tables.todos.id,
    title: tables.todos.title,
    completed: tables.todos.completed,
    createdAt: tables.todos.createdAt,
    userId: tables.todos.userId
  })

  return todo
})
