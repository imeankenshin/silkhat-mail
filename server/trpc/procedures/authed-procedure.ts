import { TRPCError } from '@trpc/server'
import { baseProcedure } from '../init'
import { provideGoogleAccessToken, provideSession, useSession } from '../context/session'

export const authedProcedure = baseProcedure.use(async ({ next }) => {
  const auth = serverAuth()
  const event = useEvent()
  const session = await auth.api.getSession(event)
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return provideSession(session, next)
})

export const googleAuthedProcedure = authedProcedure.use(async ({ next }) => {
  const { user } = useSession()
  const db = useDB()
  const { data: accessToken, error: getAccessTokenError } = await tryCatch(
    db
      .select({
        accessToken: tables.account.accessToken
      })
      .from(tables.account)
      .where(
        and(
          eq(tables.account.providerId, 'google'),
          eq(tables.account.userId, user.id)
        )
      )
      .limit(1)
      .then(([{ accessToken }]) => accessToken)
  )
  if (getAccessTokenError) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong while authorizing',
      cause: getAccessTokenError
    })
  }

  if (!accessToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED'
    })
  }

  return provideGoogleAccessToken(accessToken, next)
})
