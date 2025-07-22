import { TRPCError } from '@trpc/server'
import { baseProcedure } from '../init'
import { provideSession } from '../context/session'

export const authedProcedure = baseProcedure.use(async ({ next }) => {
  const auth = serverAuth()
  const event = useEvent()
  const session = await auth.api.getSession(event)
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return provideSession(session, next)
})
