import { TRPCError } from '@trpc/server'
import { useGoogleAccessToken } from '../../context/session'
import type { TSendDraftInputSchema } from './send.schema'
import * as gmailService from '~~/server/services/gmail'

type SendDraftOptions = {
  input: TSendDraftInputSchema
}

export const sendDraftHandler = async ({ input }: SendDraftOptions) => {
  // TODO: Gmail APIを使用してドラフトを作成
  const accessToken = useGoogleAccessToken()

  if (accessToken === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message:
        'Google access token not found. Please re-authenticate with Google.'
    })
  }

  // Gmail APIを使用してドラフトを作成
  const { data: result, error } = await gmailService.sendDraft(
    accessToken,
    input.draftId,
    input.changedValues
  )

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update draft',
      cause: error
    })
  }

  return result
}
