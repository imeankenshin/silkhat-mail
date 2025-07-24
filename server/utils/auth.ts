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
        prompt: 'consent',
        accessType: 'offline',
        clientId: config.googleClientId!,
        clientSecret: config.googleClientSecret!,
        callbackUrl: config.googleRedirectUrl!,
        scope: ['https://www.googleapis.com/auth/gmail.readonly']
      }
    }
  })
}
