import { createTRPCRouter } from '../../init'
import { googleAuthedProcedure } from '../../procedures/authed-procedure'
import { listHandler } from './list.handler'
import { AListMailsInputSchema } from './list.schema'
import { toggleStarHandler } from './toggleStar.handler'
import { AToggleStarInputSchema } from './toggleStar.schema'
import { AArchiveMailInputSchema } from './archive.schema'
import { archiveMailHandler } from './archive.handler'
import { trashMailHandler } from './trash.handler'
import { ATrashMailInputSchema } from './trash.schema'
import { getHandler } from './get.handler'
import { AGetMailsInputSchema } from './get.schema'
import { sendHandler } from './send.handler'
import { ASendMailInputSchema } from './send.schema'

export const mailRoutes = createTRPCRouter({
  get: googleAuthedProcedure
    .input(AGetMailsInputSchema)
    .query(async ({ input }) => getHandler({ input })),
  list: googleAuthedProcedure
    .input(AListMailsInputSchema)
    .query(async ({ input }) => listHandler({ input })),
  toggleStar: googleAuthedProcedure
    .input(AToggleStarInputSchema)
    .mutation(({ input }) => toggleStarHandler({ input })),
  archive: googleAuthedProcedure
    .input(AArchiveMailInputSchema)
    .mutation(({ input }) => archiveMailHandler({ input })),
  trash: googleAuthedProcedure
    .input(ATrashMailInputSchema)
    .mutation(({ input }) => trashMailHandler({ input })),
  send: googleAuthedProcedure
    .input(ASendMailInputSchema)
    .mutation(({ input }) => sendHandler({ input }))
})
