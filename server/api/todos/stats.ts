import { sql } from 'drizzle-orm'

export default eventHandler(async () => {
  // Count the total number of todos
  const [{ todos, users }] = await useDB().select({
    todos: sql<number>`count(*)`,
    users: sql<number>`count(distinct(${tables.todos.userId}))`
  }).from(tables.todos).limit(1)

  return { todos, users }
})
