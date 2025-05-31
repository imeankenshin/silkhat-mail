import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import { createTRPCContext } from '~~/server/trpc/init'
import onErrorHandler from '~~/server/trpc/on-error-handler'
import { appRouter } from '~~/server/trpc/routers/_app'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc',
  router: appRouter,
  createContext: createTRPCContext,
  onError: onErrorHandler
})
