import { TRPCClientError } from '@trpc/client'
import type { AppRouter } from '~~/server/trpc/routers/_app'

export function isTRPCClientError(err: unknown): err is TRPCClientError<AppRouter> {
  return err instanceof TRPCClientError
}
