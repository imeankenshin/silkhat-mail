import { google } from 'googleapis'
import type { IGmailService, GetMessagesOptions, GmailMessage } from './gmail.interface'

export class GmailService implements IGmailService {
  async getMessages(accessToken: string, options: GetMessagesOptions = {}) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const gmail = google.gmail({ version: 'v1', auth })

    // メッセージIDのリストを取得
    const { data: listResponse, error } = await tryCatch(gmail.users.messages.list({
      userId: 'me',
      maxResults: options.maxResults || 10,
      pageToken: options.pageToken,
      q: options.q
    }))
    if (error !== null) {
      return failure(error)
    }

    if (!listResponse.data.messages) {
      return success([])
    }

    // 各メッセージの詳細を取得
    const messages = await Promise.all(
      listResponse.data.messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date']
        })

        return this.#formatMessage(messageResponse.data)
      })
    )

    return success(messages)
  }

  #formatMessage(messageData: {
    id?: string | null
    threadId?: string | null
    snippet?: string | null
    payload?: {
      headers?: Array<{ name?: string | null, value?: string | null }> | null
    } | null
    internalDate?: string | null
    sizeEstimate?: number | null
  }): GmailMessage {
    const headers = messageData.payload?.headers?.filter(
      (header): header is { name: string, value: string } =>
        header.name != null && header.value != null
    ).map(header => ({
      name: header.name,
      value: header.value
    })) || []

    return {
      id: messageData.id || '',
      threadId: messageData.threadId || '',
      snippet: messageData.snippet || '',
      payload: {
        headers
      },
      internalDate: messageData.internalDate || '',
      sizeEstimate: messageData.sizeEstimate || 0
    }
  }
}
