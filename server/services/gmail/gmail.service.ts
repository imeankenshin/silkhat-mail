import type { IGmailService, GetMessagesOptions } from './gmail.interface'

const GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1'

const formattableFromPatterns = [
  /^"([^"]+)" <([^>]+)>$/,
  /^([^<]+) <([^>]+)>$/
] as const

export class GmailService implements IGmailService {
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
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return undefined as T
    }

    return response.json()
  }

  async getMessage(accessToken: string, id: string) {
    const metadataHeaders = ['From', 'To', 'Subject', 'Date']
    const params = new URLSearchParams()
    metadataHeaders.forEach(h => params.append('metadataHeaders', h))
    const { data: result, error } = await tryCatch(this.#fetchGmailApi<GmailMessage>(
      accessToken,
      `/users/me/messages/${id!}?${params.toString()}`
    ))
    if (error !== null) {
      return failure(error)
    }
    return success(this.#formatMessage(result))
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
      this.#fetchGmailApi(accessToken, `/users/me/messages/${messageId}/modify`, {
        method: 'POST',
        body: JSON.stringify({
          [requestBodyKey]: ['STARRED']
        })
      })
    )

    if (toggleStarError !== null) {
      return failure(toggleStarError)
    }

    return success(undefined)
  }

  async archive(accessToken: string, messageId: string) {
    const { error: archiveError } = await tryCatch(
      this.#fetchGmailApi(accessToken, `/users/me/messages/${messageId}/modify`, {
        method: 'POST',
        body: JSON.stringify({
          removeLabelIds: ['INBOX']
        })
      })
    )

    if (archiveError !== null) {
      return failure(archiveError)
    }

    return success(undefined)
  }

  async trash(accessToken: string, messageId: string) {
    const { error: trashError } = await tryCatch(
      this.#fetchGmailApi(accessToken, `/users/me/messages/${messageId}/trash`, {
        method: 'POST'
      })
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

  #formatFrom(from: string | null) {
    if (!from) return null
    for (const pattern of formattableFromPatterns) {
      const match = from.match(pattern)
      if (match) return match[1]
    }
    return from
  }
}
