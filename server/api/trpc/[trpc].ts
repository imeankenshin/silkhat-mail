import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import onErrorHandler from '~~/server/trpc/on-error-handler'
import { appRouter } from '~~/server/trpc/routers/_app'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc',
  router: appRouter,
  onError: onErrorHandler
})
