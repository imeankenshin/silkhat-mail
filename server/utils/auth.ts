import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import { useDB } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(useDB(), {
    provider: 'pg'
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackUrl: process.env.GOOGLE_REDIRECT_URL!
    }
  }
})

export const authorize = async (event: H3Event) => {
  const session = await auth.api.getSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return session
}
