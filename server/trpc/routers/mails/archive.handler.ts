import { TRPCError } from '@trpc/server'
import type { TArchiveMailInputSchema } from './archive.schema'
import { TokenService } from '~~/server/services/auth/token.service'
import { GmailService } from '~~/server/services/gmail/gmail.service'
import type { User } from '~~/types/auth'

type ArchiveMailOptions = {
  ctx: {
    user: User
  }
  input: TArchiveMailInputSchema
}

export async function archiveMailHandler({ ctx, input }: ArchiveMailOptions) {
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
  const { data: messages, error } = await gmailService.archive(accessToken, input.id)

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch emails'
    })
  }

  return messages
}
