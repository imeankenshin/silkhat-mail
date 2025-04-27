import type { BaseSchema, BaseIssue, ValiError } from 'valibot'
import { isValiError } from 'valibot'
import { TRPCClientError } from '@trpc/client'
import type { NuxtError } from '#app'
import type { AppRouter } from '~~/server/trpc/routers/_app'

export function isNuxtValiError(err: unknown): err is NuxtError<{ data: ValiError<BaseSchema<unknown, unknown, BaseIssue<unknown>>> }> {
  return (
    isNuxtError(err)
    && isValiError((err.data as { data?: unknown })?.data)
  )
}

export function isTRPCClientError(err: unknown): err is TRPCClientError<AppRouter> {
  return err instanceof TRPCClientError
}

export function isTRPCClientValidationError(err: unknown): err is TRPCClientError<AppRouter> {
  return isTRPCClientError(err) && err.data?.code === 'BAD_REQUEST'
}
