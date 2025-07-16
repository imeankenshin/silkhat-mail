import { TRPCError } from '@trpc/server'
import type { TGetMailsInputSchema } from './get.schema'
import type { User } from '~~/types/auth'
import { GmailService } from '~~/server/services/gmail/gmail.service'
import { TokenService } from '~~/server/services/auth/token.service'

type GetMailsOptions = {
  ctx: {
    user: User
  }
  input: TGetMailsInputSchema
}

export async function getHandler({ ctx, input }: GetMailsOptions) {
  const gmailService = new GmailService()
  const tokenService = new TokenService()
  // ユーザーのGoogleアクセストークンを取得
  const { data: accessToken, error: accessTokenError } = await tokenService.getGoogleAccessToken(ctx.user.id)

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
  const { data: messages, error } = await gmailService.getMessages(accessToken, {
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
