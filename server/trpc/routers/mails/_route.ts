import { parse } from 'valibot'
import { createTRPCRouter } from '../../init'
import { authedProcedure } from '../../procedures/authed-procedure'
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

export const mailRoutes = createTRPCRouter({
  get: authedProcedure
    .input(v => parse(VGetMailsInputSchema, v))
    .query(async ({ input }) => getHandler({ input })),
  list: authedProcedure
    .input(v => parse(VListMailsInputSchema, v))
    .query(async ({ input }) => listHandler({ input })),
  toggleStar: authedProcedure
    .input(v => parse(VToggleStarInputSchema, v))
    .mutation(({ input }) => toggleStarHandler({ input })),
  archive: authedProcedure
    .input(v => parse(VArchiveMailInputSchema, v))
    .mutation(({ input }) => archiveMailHandler({ input })),
  trash: authedProcedure
    .input(v => parse(VTrashMailInputSchema, v))
    .mutation(({ input }) => trashMailHandler({ input }))
})
