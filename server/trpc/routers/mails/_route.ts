import { parse } from 'valibot'
import { createTRPCRouter } from '../../init'
import { googleAuthedProcedure } from '../../procedures/authed-procedure'
import { listHandler } from './list.handler'
import { VListMailsInputSchema } from './list.schema'
import { toggleStarHandler } from './toggleStar.handler'
import { VToggleStarInputSchema } from './toggleStar.schema'
import { VArchiveMailInputSchema } from './archive.schema'
import { archiveMailHandler } from './archive.handler'
import { trashMailHandler } from './trash.handler'
import { VTrashMailInputSchema } from './trash.schema'
import { getHandler } from './get.handler'
import { VGetMailsInputSchema } from './get.schema'
import { sendHandler } from './send.handler'
import { VSendMailInputSchema } from './send.schema'

export const mailRoutes = createTRPCRouter({
  get: googleAuthedProcedure
    .input(v => parse(VGetMailsInputSchema, v))
    .query(async ({ input }) => getHandler({ input })),
  list: googleAuthedProcedure
    .input(v => parse(VListMailsInputSchema, v))
    .query(async ({ input }) => listHandler({ input })),
  toggleStar: googleAuthedProcedure
    .input(v => parse(VToggleStarInputSchema, v))
    .mutation(({ input }) => toggleStarHandler({ input })),
  archive: googleAuthedProcedure
    .input(v => parse(VArchiveMailInputSchema, v))
    .mutation(({ input }) => archiveMailHandler({ input })),
  trash: googleAuthedProcedure
    .input(v => parse(VTrashMailInputSchema, v))
    .mutation(({ input }) => trashMailHandler({ input })),
  send: googleAuthedProcedure
    .input(v => parse(VSendMailInputSchema, v))
    .mutation(({ input }) => sendHandler({ input }))
})
