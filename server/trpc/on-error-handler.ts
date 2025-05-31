import type { TRPCError } from '@trpc/server'

type OnErrorHandlerParams = {
  error: TRPCError
}

export function onErrorHandler({ error }: OnErrorHandlerParams) {
  if (error.code === 'INTERNAL_SERVER_ERROR') {
    // TODO: send error to your error reporting service
    console.error('Something went wrong', error)
  }
}
export default onErrorHandler
