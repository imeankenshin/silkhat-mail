import { TRPCError } from '@trpc/server'
import type { TListMailsInputSchema } from './list.schema'
import { useGoogleAccessToken } from '~~/server/trpc/context/session'
import * as gmailService from '~~/server/services/gmail'

type listMailsOptions = {
  input: TListMailsInputSchema
}

export async function listHandler({ input }: listMailsOptions) {
  const accessToken = useGoogleAccessToken()

  // Gmail APIを使用してメッセージを取得
  const { data: messages, error } = await gmailService.listMessages(accessToken, {
    maxResults: input.maxResults || 10,
    pageToken: input.pageToken,
    q: input.q || 'in:inbox'
  })

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch emails',
      cause: error
    })
  }

  return messages
}
