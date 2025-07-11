import { google } from 'googleapis'
import type { IGmailService, GetMessagesOptions } from './gmail.interface'

const formattableFromPatterns = [
  /^"([^"]+)" <([^>]+)>$/,
  /^([^<]+) <([^>]+)>$/
] as const

export class GmailService implements IGmailService {
  async getMessages(accessToken: string, options: GetMessagesOptions = {}) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const gmail = google.gmail({ version: 'v1', auth })

    // メッセージIDのリストを取得
    const { data: listResponse, error } = await tryCatch(
      gmail.users.messages.list({
        userId: 'me',
        maxResults: options.maxResults || 10,
        pageToken: options.pageToken,
        q: options.q
      })
    )
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
          metadataHeaders: ['From', 'To', 'Subject', 'Date', 'Labels']
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
  }): Mail {
    const headers
      = messageData.payload?.headers
        ?.filter(
          (header): header is { name: string, value: string } =>
            header.name != null && header.value != null
        )
        .map(header => ({
          name: header.name,
          value: header.value
        })) || []

    const from = this.#formatFrom(
      headers.find(h => h.name === 'From')?.value || null
    )
    const to = headers.find(h => h.name === 'To')?.value || null
    const subject = headers.find(h => h.name === 'Subject')?.value || null
    const date = headers.find(h => h.name === 'Date')?.value || null
    return {
      id: messageData.id || '',
      threadId: messageData.threadId || '',
      snippet: messageData.snippet || '',
      sizeEstimate: messageData.sizeEstimate || 0,
      from,
      to,
      subject,
      date,
      labels: headers.find(h => h.name === 'Labels')?.value?.split(',') || []
    }
  }

  /**
   * @example
   * formatFrom('Kenshin Omura <kenshin.omura@gmail.com>')
   * // => { name: 'Kenshin Omura', email: 'kenshin.omura@gmail.com' }
   * formatFrom('kenshin.omura@gmail.com')
   * // => 'kenshin.omura@gmail.com'
   * formatFrom('"Kenshin Omura" <kenshin.omura@gmail.com>')
   * // => { name: 'Kenshin Omura', email: 'kenshin.omura@gmail.com' }
   */
  #formatFrom(from: string | null) {
    if (!from) return null
    for (const pattern of formattableFromPatterns) {
      const match = from.match(pattern)
      if (match) return match[1]
    }
    return from
  }
}
