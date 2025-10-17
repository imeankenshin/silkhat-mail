import { TRPCError } from '@trpc/server'
import type { TArchiveMailInputSchema } from './archive.schema'
import { useGoogleAccessToken } from '~~/server/trpc/context/session'
import * as gmailService from '~~/server/services/gmail'

type ArchiveMailOptions = {
  input: TArchiveMailInputSchema
}

export async function archiveMailHandler({ input }: ArchiveMailOptions) {
  const accessToken = useGoogleAccessToken()

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
