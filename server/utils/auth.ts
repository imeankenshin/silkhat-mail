import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { useDB } from './db'

let _databaseAdapter: ReturnType<typeof drizzleAdapter> | null = null

export const serverAuth = () => {
  const config = useRuntimeConfig(useEvent())
  return betterAuth({

    get database() {
      if (!_databaseAdapter) {
        _databaseAdapter = drizzleAdapter(useDB(), {
          provider: 'pg'
        })
      }
      return _databaseAdapter
    },
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
