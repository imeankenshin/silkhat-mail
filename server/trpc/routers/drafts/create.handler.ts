import { TRPCError } from '@trpc/server'
import { useGoogleAccessToken } from '../../context/session'
import type { TCreateDraftInputSchema } from './create.schema'
import * as gmailService from '~~/server/services/gmail'

type CreateDraftOptions = {
  input: TCreateDraftInputSchema
}

export const createDraftHandler = async ({
  input
}: CreateDraftOptions) => {
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
  const { data: result, error } = await gmailService.createDraft(
    accessToken,
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
