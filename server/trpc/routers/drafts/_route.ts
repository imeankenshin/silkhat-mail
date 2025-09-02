import { parse } from 'valibot'
import { createTRPCRouter } from '../../init'
import { googleAuthedProcedure } from '../../procedures/authed-procedure'
import { VCreateDraftInputSchema } from './create.schema'
import { createDraftHandler } from './create.handler'
import { updateDraftHandler } from './update.handler'
import { VUpdateDraftInputSchema } from './update.schema'

export const draftRoutes = createTRPCRouter({
  create: googleAuthedProcedure
    .input(v => parse(VCreateDraftInputSchema, v))
    .mutation(({ input }) => createDraftHandler({ input })),
  update: googleAuthedProcedure
    .input(v => parse(VUpdateDraftInputSchema, v))
    .mutation(({ input }) => updateDraftHandler({ input }))
})
