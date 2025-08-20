import { TRPCError } from '@trpc/server'
import type { TToggleStarInputSchema } from './toggleStar.schema'
import { useGoogleAccessToken } from '~~/server/trpc/context/session'
import { GmailService } from '~~/server/services/gmail/gmail.service'

type ToggleStarOptions = {
  input: TToggleStarInputSchema
}

export async function toggleStarHandler({ input }: ToggleStarOptions) {
  const gmailService = new GmailService()
  const accessToken = useGoogleAccessToken()

  // Gmail APIを使用してメッセージを取得
  const { data: messages, error } = await gmailService.toggleStar(accessToken, input.id, input.value)

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch emails',
      cause: error
    })
  }

  return messages
}
