import { createTRPCRouter } from '../init'
import { todoRoutes } from './todos/_route'

export const appRouter = createTRPCRouter({
  todos: todoRoutes
})

export type AppRouter = typeof appRouter
