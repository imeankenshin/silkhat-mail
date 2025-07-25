import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { isValiError } from 'valibot'

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
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
          issues: error.cause.issues.flat()
        }
      }
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        issues: undefined
      }
    }
  }
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
