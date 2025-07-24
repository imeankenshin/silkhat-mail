import { TRPCError } from '@trpc/server'
import type { TGetMailsInputSchema } from './get.schema'
import { useSession } from '~~/server/trpc/context/session'
import { GmailService } from '~~/server/services/gmail/gmail.service'
import { TokenService } from '~~/server/services/auth/token.service'

type getMailOptions = {
  input: TGetMailsInputSchema
}

export async function getHandler({ input }: getMailOptions) {
  const { user } = useSession()
  const gmailService = new GmailService()
  const tokenService = new TokenService()
  // ユーザーのGoogleアクセストークンを取得
  const { data: accessToken, error: accessTokenError } = await tokenService.getGoogleAccessToken(user.id)

  if (accessTokenError !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to get Google access token.',
      cause: accessTokenError
    })
  }

  if (accessToken === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Google access token not found. Please re-authenticate with Google.'
    })
  }

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
