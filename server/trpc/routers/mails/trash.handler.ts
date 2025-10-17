import { TRPCError } from '@trpc/server'
import type { TTrashMailInputSchema } from './trash.schema'
import { useGoogleAccessToken } from '~~/server/trpc/context/session'
import * as gmailService from '~~/server/services/gmail'

type TrashMailOptions = {
  input: TTrashMailInputSchema
}

export async function trashMailHandler({ input }: TrashMailOptions) {
  const accessToken = useGoogleAccessToken()
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
