import { TRPCError } from '@trpc/server'
import { baseProcedure } from '../init'

export const authedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession(ctx.event)
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, ...session } })
})
