import { TRPCError } from '@trpc/server'
import type { TListMailsInputSchema } from './list.schema'
import { useSession } from '~~/server/trpc/context/session'
import { GmailService } from '~~/server/services/gmail/gmail.service'
import { TokenService } from '~~/server/services/auth/token.service'

type listMailsOptions = {
  input: TListMailsInputSchema
}

export async function listHandler({ input }: listMailsOptions) {
  const { user } = useSession()
  const gmailService = new GmailService()
  const tokenService = new TokenService()
  // ユーザーのGoogleアクセストークンを取得
  const { data: accessToken, error: accessTokenError } = await tokenService.getGoogleAccessToken(user.id)

  if (accessTokenError !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to get Google access token.'
    })
  }

  if (accessToken === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Google access token not found. Please re-authenticate with Google.'
    })
  }

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
