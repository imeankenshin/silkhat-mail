import { TRPCError } from '@trpc/server'
import { useGoogleAccessToken } from '../../context/session'
import type { TUpdateDraftInputSchema } from './update.schema'
import { GmailService } from '~~/server/services/gmail/gmail.service'

type UpdateDraftOptions = {
  input: TUpdateDraftInputSchema
}

export const updateDraftHandler = async ({
  input
}: UpdateDraftOptions) => {
  // TODO: Gmail APIを使用してドラフトを作成
  const gmailService = new GmailService()
  const accessToken = useGoogleAccessToken()

  if (accessToken === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message:
        'Google access token not found. Please re-authenticate with Google.'
    })
  }

  // Gmail APIを使用してドラフトを作成
  const { data: result, error } = await gmailService.updateDraft(
    accessToken,
    input.draftId,
    input
  )

  if (error !== null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create draft',
      cause: error
    })
  }

  return result
}
