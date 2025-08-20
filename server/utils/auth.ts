import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { useDB } from './db'

export const serverAuth = () => {
  const config = useRuntimeConfig(useEvent())
  return betterAuth({
    database: drizzleAdapter(useDB(), {
      provider: 'pg'
    }),
    secret: config.betterAuthSecret!,
    socialProviders: {
      google: {
        accessType: 'offline',
        // @ts-expect-error: 'select_account consent' is actually a valid value.
        prompt: 'select_account consent',
        clientId: config.google.clientId!,
        clientSecret: config.google.clientSecret!,
        callbackUrl: config.google.redirectUrl!,
        scope: ['https://mail.google.com/']
      }
    }
  })
}
