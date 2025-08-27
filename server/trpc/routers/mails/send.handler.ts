import { TRPCError } from '@trpc/server'
import { useGoogleAccessToken } from '../../context/session'
import type { TSendMailInputSchema } from './send.schema'
import { GmailService } from '~~/server/services/gmail/gmail.service'

type SendMailOptions = {
  input: TSendMailInputSchema
}

export const sendHandler = async ({ input }: SendMailOptions) => {
  const gmailService = new GmailService()
  const accessToken = useGoogleAccessToken()

  if (accessToken === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Google access token not found. Please re-authenticate with Google.'
    })
  }

  // Gmail APIを使用してメッセージを送信
  const { data: result, error } = await gmailService.sendMessage(
    accessToken,
    input
  )

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to send emails',
      cause: error
    })
  }

  return result
}
