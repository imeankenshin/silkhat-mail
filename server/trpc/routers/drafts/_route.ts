import { createTRPCRouter } from '../../init'
import { googleAuthedProcedure } from '../../procedures/authed-procedure'
import { ACreateDraftInputSchema } from './create.schema'
import { createDraftHandler } from './create.handler'
import { updateDraftHandler } from './update.handler'
import { AUpdateDraftInputSchema } from './update.schema'
import { ASendDraftInputSchema } from './send.schema'
import { sendDraftHandler } from './send.handler'

export const draftRoutes = createTRPCRouter({
  create: googleAuthedProcedure
    .input(ACreateDraftInputSchema)
    .mutation(({ input }) => createDraftHandler({ input })),
  update: googleAuthedProcedure
    .input(AUpdateDraftInputSchema)
    .mutation(({ input }) => updateDraftHandler({ input })),
  send: googleAuthedProcedure
    .input(ASendDraftInputSchema)
    .mutation(({ input }) => sendDraftHandler({ input }))
})
