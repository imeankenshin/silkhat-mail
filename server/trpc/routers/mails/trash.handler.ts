import { TRPCError } from '@trpc/server'
import type { TTrashMailInputSchema } from './trash.schema'
import { useSession } from '~~/server/trpc/context/session'
import { TokenService } from '~~/server/services/auth/token.service'
import { GmailService } from '~~/server/services/gmail/gmail.service'

type TrashMailOptions = {
  input: TTrashMailInputSchema
}

export async function trashMailHandler({ input }: TrashMailOptions) {
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
  const { data: messages, error } = await gmailService.trash(accessToken, input.id)

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch emails',
      cause: error
    })
  }

  return messages
}
