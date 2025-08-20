import { TRPCError } from '@trpc/server'
import { baseProcedure } from '../init'
import {
  provideGoogleAccessToken,
  provideSession,
  useSession
} from '../context/session'

export const authedProcedure = baseProcedure.use(async ({ next }) => {
  const auth = serverAuth()
  const event = useEvent()
  const session = await auth.api.getSession(event)
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return provideSession(session, next)
})

// server/trpc/procedures/authed-procedure.ts
export const googleAuthedProcedure = authedProcedure.use(async ({ next }) => {
  const { user } = useSession()
  const db = useDB()
  const config = useRuntimeConfig(useEvent())

  const { data: account, error: accountErr } = await tryCatch(
    db
      .select({
        id: tables.account.id,
        accessToken: tables.account.accessToken,
        accessTokenExpiresAt: tables.account.accessTokenExpiresAt,
        refreshToken: tables.account.refreshToken
      })
      .from(tables.account)
      .where(
        and(
          eq(tables.account.providerId, 'google'),
          eq(tables.account.userId, user.id)
        )
      )
      .limit(1)
      .then(rows => rows[0] ?? null)
  )
  if (accountErr) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Authorization lookup failed',
      cause: accountErr
    })
  }
  if (!(account && account.refreshToken)) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const now = new Date()
  const expired
    = account.accessTokenExpiresAt && account.accessTokenExpiresAt < now
  let tokenToUse = account.accessToken ?? null

  if (!tokenToUse || expired) {
    const body = new URLSearchParams({
      client_id: config.google.clientId!,
      client_secret: config.google.clientSecret!,
      refresh_token: account.refreshToken,
      grant_type: 'refresh_token'
    })

    const { data: resp, error: refreshErr } = await tryCatch(
      $fetch<{ access_token: string, expires_in?: number }>(
        'https://oauth2.googleapis.com/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        }
      )
    )
    if (refreshErr) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to refresh Google access token',
        cause: refreshErr
      })
    }

    tokenToUse = resp.access_token
    const expiresAt = new Date(Date.now() + (resp.expires_in ?? 3600) * 1000)

    const { error: updateErr } = await tryCatch(
      db
        .update(tables.account)
        .set({ accessToken: tokenToUse, accessTokenExpiresAt: expiresAt })
        .where(eq(tables.account.id, account.id))
    )
    if (updateErr) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to persist refreshed token',
        cause: updateErr
      })
    }
  }

  if (!tokenToUse) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return provideGoogleAccessToken(tokenToUse, next)
})
