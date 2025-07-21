import { TRPCError } from '@trpc/server'
import { baseProcedure } from '../init'
import { provideUser } from '../context/user-context'

export const authedProcedure = baseProcedure.use(async ({ next }) => {
  const auth = serverAuth()
  const event = useEvent()
  const session = await auth.api.getSession(event)
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const result = await provideUser(session, next)
  return result
})
