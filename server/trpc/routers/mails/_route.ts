import { parse } from 'valibot'
import { createTRPCRouter } from '../../init'
import { authedProcedure } from '../../procedures/authed-procedure'
import { getHandler } from './get.handler'
import { VGetMailsInputSchema } from './get.schema'
import { toggleStarHandler } from './toggleStar.handler'
import { VToggleStarInputSchema } from './toggleStar.schema'
import { VArchiveMailInputSchema } from './archive.schema'
import { archiveMailHandler } from './archive.handler'
import { trashMailHandler } from './trash.handler'
import { VTrashMailInputSchema } from './trash.schema'

export const mailRoutes = createTRPCRouter({
  get: authedProcedure
    .input(v => parse(VGetMailsInputSchema, v))
    .query(async ({ input }) => getHandler({ input })),
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
