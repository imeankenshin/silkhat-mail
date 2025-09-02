import { createTRPCRouter } from '../init'
import { draftRoutes } from './drafts/_route'
import { mailRoutes } from './mails/_route'

export const appRouter = createTRPCRouter({
  mails: mailRoutes,
  drafts: draftRoutes
})

export type AppRouter = typeof appRouter
