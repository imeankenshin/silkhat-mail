import { createTRPCRouter } from '../init'
import { mailRoutes } from './mails/_route'

export const appRouter = createTRPCRouter({
  mails: mailRoutes
})

export type AppRouter = typeof appRouter
