import { parse } from 'valibot'
import { createTRPCRouter } from '../../init'
import { authedProcedure } from '../../procedures/authed-procedure'
import { getHandler } from './get.handler'
import { VGetMailsInputSchema } from './get.schema'

export const mailRoutes = createTRPCRouter({
  get: authedProcedure.input(v => parse(VGetMailsInputSchema, v)).query(({ ctx, input }) =>
    getHandler({ ctx, input })
  )
})
