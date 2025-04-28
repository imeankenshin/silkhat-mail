import { initTRPC } from '@trpc/server'
import type { H3Event } from 'h3'
import superjson from 'superjson'
import { isValiError } from 'valibot'

export const createTRPCContext = async (event: H3Event) => {
  return { event }
}

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
  * @see https://trpc.io/docs/server/data-transformers
  */
  transformer: superjson,
  errorFormatter: ({ error, shape }) => {
    // Valibot のバリデーションエラーを処理
    if (isValiError(error.cause)) {
      return {
        ...shape,
        data: {
          ...shape.data,
          issues: error.cause.issues.flat(),
          userFriendly: true
        }
      }
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        issues: null,
        userFriendly: shape.data.code !== 'INTERNAL_SERVER_ERROR'
      }
    }
  }
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
