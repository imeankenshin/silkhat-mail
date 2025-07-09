import { createTRPCRouter } from '../init'
import { todoRoutes } from './todos/_route'
import { mailRoutes } from './mails/_route'

export const appRouter = createTRPCRouter({
  todos: todoRoutes,
  mails: mailRoutes
})

export type AppRouter = typeof appRouter
