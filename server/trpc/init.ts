import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ArkError } from 'arktype'

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
    if (error.cause instanceof ArkError) {
      return {
        ...shape,
        data: {
          ...shape.data,
          issues: error.cause.flat
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
