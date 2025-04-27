import { parse } from 'valibot'
import { createTRPCRouter } from '../../init'
import { authedProcedure } from '../../procedures/authed-procedure'
import { deleteHandler } from './delete.handler'
import { VDeleteInputSchema } from './delete.schema'
import { getHandler } from './get.handler'
import { VAddInputSchema } from './add.schema'
import { addHandler } from './add.handler'
import { VUpdateInputSchema } from './update.schema'
import { updateHandler } from './update.handler'

export const todoRoutes = createTRPCRouter({
  delete: authedProcedure.input(v => parse(VDeleteInputSchema, v)).mutation(({ ctx, input }) =>
    deleteHandler({ ctx, input })
  ),
  get: authedProcedure.query(({ ctx }) =>
    getHandler({ ctx })
  ),
  add: authedProcedure.input(v => parse(VAddInputSchema, v)).mutation(({ ctx, input }) =>
    addHandler({ ctx, input })
  ),
  update: authedProcedure.input(v => parse(VUpdateInputSchema, v)).mutation(({ ctx, input }) =>
    updateHandler({ ctx, input })
  )
})
