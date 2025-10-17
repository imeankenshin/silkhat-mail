import { TRPCError } from '@trpc/server'
import type { TGetMailsInputSchema } from './get.schema'
import { useGoogleAccessToken } from '~~/server/trpc/context/session'
import * as gmailService from '~~/server/services/gmail'

type getMailOptions = {
  input: TGetMailsInputSchema
}

export async function getHandler({ input }: getMailOptions) {
  const accessToken = useGoogleAccessToken()

  // Gmail APIを使用してメッセージを取得
  const { data: message, error } = await gmailService.getMessage(accessToken, input.id)

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch email',
      cause: error
    })
  }

  return message
}
