import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { useDB } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(useDB(), {
    provider: 'pg',
    debugLogs: true
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackUrl: process.env.GOOGLE_REDIRECT_URL!
    }
  }
})
