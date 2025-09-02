import type { IGmailService, GetMessagesOptions } from './gmail.interface'

const GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1'

const formattableFromPatterns = [
  /^"([^"]+)" <([^>]+)>$/,
  /^([^<]+) <([^>]+)>$/
] as const

export class GmailService implements IGmailService {
  async sendMessage(
    accessToken: string,
    input: { to: string, subject: string, content: string }
  ): Promise<Result<undefined, Error>> {
    // RFC 2822形式のメールメッセージを作成
    const emailContent = [
      `Content-Type: text/plain; charset="UTF-8"`,
      `MIME-Version: 1.0`,
      `Content-Transfer-Encoding: 7bit`,
      `to: ${input.to}`,
      `subject: ${input.subject}`,
      ``,
      `${input.content}`
    ].join('\n')

    // メールメッセージをBase64エンコード
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const { error: sendError } = await tryCatch(
      this.#fetchGmailApi(accessToken, `/users/me/messages/send`, {
        method: 'POST',
        body: JSON.stringify({
          raw: base64EncodedEmail
        })
      })
    )

    if (sendError !== null) {
      return failure(sendError)
    }

    return success(undefined)
  }

  async createDraft(
    accessToken: string,
    input: { to?: string, subject?: string, content?: string }
  ) {
    const emailContent = [
      `Content-Type: text/plain; charset="UTF-8"`,
      `MIME-Version: 1.0`,
      `Content-Transfer-Encoding: 7bit`,
      `to: ${input.to}`,
      `subject: ${input.subject}`,
      ``,
      `${input.content}`
    ].join('\n')

    // メールメッセージをBase64エンコード
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const { error: createDraftError, data: draft } = await tryCatch(
      this.#fetchGmailApi<GmailDraft>(accessToken, `/users/me/drafts`, {
        method: 'POST',
        body: JSON.stringify({
          message: {
            raw: base64EncodedEmail
          }
        })
      })
    )
    if (createDraftError !== null) {
      return failure(createDraftError)
    }
    return success(draft)
  }

  async updateDraft(
    accessToken: string,
    id: string,
    input: { to?: string, subject?: string, content?: string }
  ) {
    const emailContent = [
      `Content-Type: text/plain; charset="UTF-8"`,
      `MIME-Version: 1.0`,
      `Content-Transfer-Encoding: 7bit`,
      `to: ${input.to}`,
      `subject: ${input.subject}`,
      ``,
      `${input.content}`
    ].join('\n')

    // メールメッセージをBase64エンコード
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const { error: createDraftError, data: draft } = await tryCatch(
      this.#fetchGmailApi<GmailDraft>(accessToken, `/users/me/drafts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: {
            raw: base64EncodedEmail
          }
        })
      })
    )
    if (createDraftError !== null) {
      return failure(createDraftError)
    }
    return success(draft)
  }

  /**
   * Gmail APIと通信するための汎用fetchラッパー
   */
  async #fetchGmailApi<T>(
    accessToken: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${GMAIL_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      // Google APIのエラー構造: { error: { code, message, errors, status } }
      throw new Error(error.error?.message || 'Gmail API request failed')
    }

    // modifyやtrashのような空のレスポンスボディを処理
    if (
      response.status === 204
      || response.headers.get('Content-Length') === '0'
    ) {
      return undefined as T
    }

    return response.json()
  }

  async getMessage(accessToken: string, id: string) {
    const metadataHeaders = ['From', 'To', 'Subject', 'Date']
    const params = new URLSearchParams()
    params.append('format', 'full')
    metadataHeaders.forEach(h => params.append('metadataHeaders', h))
    const { data: result, error } = await tryCatch(
      this.#fetchGmailApi<GmailMessage>(
        accessToken,
        `/users/me/messages/${id!}?${params.toString()}`
      )
    )
    if (error !== null) {
      return failure(error)
    }
    return success(this.#formatFullMessage(result))
  }

  async listMessages(accessToken: string, options: GetMessagesOptions = {}) {
    const queryParams = new URLSearchParams()
    queryParams.append('maxResults', (options.maxResults || 10).toString())
    if (options.pageToken) {
      queryParams.append('pageToken', options.pageToken)
    }
    if (options.q) {
      queryParams.append('q', options.q)
    }

    const { data: listResponse, error } = await tryCatch(
      this.#fetchGmailApi<ListMessagesResponse>(
        accessToken,
        `/users/me/messages?${queryParams.toString()}`
      )
    )

    if (error !== null) {
      return failure(error)
    }

    if (!listResponse?.messages) {
      return success([])
    }

    const metadataHeaders = ['From', 'To', 'Subject', 'Date']

    const messages = await Promise.all(
      listResponse.messages.map(async (message) => {
        const params = new URLSearchParams()
        metadataHeaders.forEach(h => params.append('metadataHeaders', h))
        const messageResponse = await this.#fetchGmailApi<GmailMessage>(
          accessToken,
          `/users/me/messages/${message.id!}?${params.toString()}`
        )
        return this.#formatMessage(messageResponse)
      })
    )
    return success(messages)
  }

  async toggleStar(accessToken: string, messageId: string, isStarred: boolean) {
    const requestBodyKey = isStarred ? 'addLabelIds' : 'removeLabelIds'
    const { error: toggleStarError } = await tryCatch(
      this.#fetchGmailApi(
        accessToken,
        `/users/me/messages/${messageId}/modify`,
        {
          method: 'POST',
          body: JSON.stringify({
            [requestBodyKey]: ['STARRED']
          })
        }
      )
    )

    if (toggleStarError !== null) {
      return failure(toggleStarError)
    }

    return success(undefined)
  }

  async archive(accessToken: string, messageId: string) {
    const { error: archiveError } = await tryCatch(
      this.#fetchGmailApi(
        accessToken,
        `/users/me/messages/${messageId}/modify`,
        {
          method: 'POST',
          body: JSON.stringify({
            removeLabelIds: ['INBOX']
          })
        }
      )
    )

    if (archiveError !== null) {
      return failure(archiveError)
    }

    return success(undefined)
  }

  async trash(accessToken: string, messageId: string) {
    const { error: trashError } = await tryCatch(
      this.#fetchGmailApi(
        accessToken,
        `/users/me/messages/${messageId}/trash`,
        {
          method: 'POST'
        }
      )
    )

    if (trashError !== null) {
      return failure(trashError)
    }

    return success(undefined)
  }

  #formatMessage(messageData: GmailMessage): Mail {
    const headers = messageData.payload?.headers || []

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
      labels: messageData.labelIds || []
    }
  }

  #getContent(message: GmailMessage) {
    if (message?.payload?.parts) {
      // HTMLとプレーンテキストの両方を探す
      const parts = message.payload.parts.filter(
        part =>
          part.mimeType === 'text/html' || part.mimeType === 'text/plain'
      )

      const htmlPart = parts.find(p => p.mimeType === 'text/html')
      const plainPart = parts.find(p => p.mimeType === 'text/plain')

      if (htmlPart) {
        return {
          content: Buffer.from(htmlPart.body.data, 'base64').toString(),
          isHTML: true
        }
      }

      if (plainPart) {
        return {
          content: Buffer.from(plainPart.body.data, 'base64').toString(),
          isHTML: false
        }
      }
    }
    if (message?.payload?.body?.data) {
      return {
        content: Buffer.from(message.payload.body.data, 'base64').toString(),
        isHTML: false
      }
    }
    return { content: '', isHTML: false }
  }

  #formatFullMessage(message: GmailMessage): FullMail {
    return {
      ...this.#formatMessage(message),
      ...this.#getContent(message)
    }
  }

  #formatFrom(from: string | null) {
    if (!from) return null
    for (const pattern of formattableFromPatterns) {
      const match = from.match(pattern)
      if (match) return match[1]
    }
    return from
  }
}
