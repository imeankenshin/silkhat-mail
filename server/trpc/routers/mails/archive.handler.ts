import { TRPCError } from '@trpc/server'
import { useUser } from '../../context/user-context'
import type { TArchiveMailInputSchema } from './archive.schema'
import { TokenService } from '~~/server/services/auth/token.service'
import { GmailService } from '~~/server/services/gmail/gmail.service'

type ArchiveMailOptions = {
  input: TArchiveMailInputSchema
}

export async function archiveMailHandler({ input }: ArchiveMailOptions) {
  const { user } = useUser()
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
  const { data: result, error } = await gmailService.archive(accessToken, input.id)

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch emails',
      cause: error
    })
  }

  return result
}
