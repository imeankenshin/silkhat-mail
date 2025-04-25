import { pgTable, text, integer } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(), // GitHub Id
  title: text('title').notNull(),
  completed: integer('completed').notNull().default(0),
  createdAt: integer('created_at').notNull()
})
