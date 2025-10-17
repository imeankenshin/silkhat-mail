const GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1'

const formattableFromPatterns = [
  /^"([^"]+)" <([^>]+)>$/,
  /^([^<]+) <([^>]+)>$/
] as const

export type GetMessagesOptions = {
  maxResults?: number
  pageToken?: string
  /**
   * Gmail search query
   */
  q?: string
}

export function sendDraft(
  accessToken: string,
  draftId: string,
  changedValues?: { to?: string, subject?: string, content?: string }
) {
  return tryCatch(
    fetchGmailApi(accessToken, `/users/me/drafts/${draftId}/send`, {
      method: 'POST',
      body: JSON.stringify({
        draftId,
        message: changedValues
          ? {
              raw: encode(changedValues)
            }
          : undefined
      })
    })
  )
}

export async function sendMessage(
  accessToken: string,
  input: { to: string, subject: string, content: string }
): Promise<Result<undefined, Error>> {
  // RFC 2822形式のメールメッセージを作成
  const { error: sendError } = await tryCatch(
    fetchGmailApi(accessToken, `/users/me/messages/send`, {
      method: 'POST',
      body: JSON.stringify({
        raw: encode(input)
      })
    })
  )

  if (sendError !== null) {
    return failure(sendError)
  }

  return success(undefined)
}

export async function createDraft(
  accessToken: string,
  input: { to?: string, subject?: string, content?: string }
) {
  const { error: createDraftError, data: draft } = await tryCatch(
    fetchGmailApi<GmailDraft>(accessToken, `/users/me/drafts`, {
      method: 'POST',
      body: JSON.stringify({
        message: {
          raw: encode(input)
        }
      })
    })
  )
  if (createDraftError !== null) {
    return failure(createDraftError)
  }
  return success(draft)
}

export async function updateDraft(
  accessToken: string,
  id: string,
  input: { to?: string, subject?: string, content?: string }
) {
  const { error: createDraftError, data: draft } = await tryCatch(
    fetchGmailApi<GmailDraft>(accessToken, `/users/me/drafts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: {
          raw: encode(input)
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
export async function fetchGmailApi<T>(
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

export async function getMessage(accessToken: string, id: string) {
  const metadataHeaders = ['From', 'To', 'Subject', 'Date']
  const params = new URLSearchParams()
  params.append('format', 'full')
  metadataHeaders.forEach(h => params.append('metadataHeaders', h))
  const { data: result, error } = await tryCatch(
    fetchGmailApi<GmailMessage>(
      accessToken,
      `/users/me/messages/${id!}?${params.toString()}`
    )
  )
  if (error !== null) {
    return failure(error)
  }
  return success(formatFullMessage(result))
}

export async function listMessages(
  accessToken: string,
  options: GetMessagesOptions = {}
) {
  const queryParams = new URLSearchParams()
  queryParams.append('maxResults', (options.maxResults || 10).toString())
  if (options.pageToken) {
    queryParams.append('pageToken', options.pageToken)
  }
  if (options.q) {
    queryParams.append('q', options.q)
  }

  const { data: listResponse, error } = await tryCatch(
    fetchGmailApi<ListMessagesResponse>(
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
      const messageResponse = await fetchGmailApi<GmailMessage>(
        accessToken,
        `/users/me/messages/${message.id!}?${params.toString()}`
      )
      return formatMessage(messageResponse)
    })
  )
  return success(messages)
}

export async function toggleStar(
  accessToken: string,
  messageId: string,
  isStarred: boolean
) {
  const requestBodyKey = isStarred ? 'addLabelIds' : 'removeLabelIds'
  const { error: toggleStarError } = await tryCatch(
    fetchGmailApi(accessToken, `/users/me/messages/${messageId}/modify`, {
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

export async function archive(accessToken: string, messageId: string) {
  const { error: archiveError } = await tryCatch(
    fetchGmailApi(accessToken, `/users/me/messages/${messageId}/modify`, {
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

export async function trash(accessToken: string, messageId: string) {
  const { error: trashError } = await tryCatch(
    fetchGmailApi(accessToken, `/users/me/messages/${messageId}/trash`, {
      method: 'POST'
    })
  )

  if (trashError !== null) {
    return failure(trashError)
  }

  return success(undefined)
}

function formatMessage(messageData: GmailMessage): Mail {
  const headers = messageData.payload?.headers || []

  const from = formatFrom(
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

function getContent(message: GmailMessage) {
  if (message?.payload?.parts) {
    // HTMLとプレーンテキストの両方を探す
    const parts = message.payload.parts.filter(
      part => part.mimeType === 'text/html' || part.mimeType === 'text/plain'
    )

    const htmlPart = parts.find(p => p.mimeType === 'text/html')
    const plainPart = parts.find(p => p.mimeType === 'text/plain')

    if (htmlPart) {
      return {
        content: Buffer.from(
          htmlPart.body.data.replace(/-/g, '+').replace(/_/g, '/'),
          'base64'
        ).toString(),
        isHTML: true
      }
    }

    if (plainPart) {
      return {
        content: Buffer.from(
          plainPart.body.data.replace(/-/g, '+').replace(/_/g, '/'),
          'base64'
        ).toString(),
        isHTML: false
      }
    }
  }
  if (message?.payload?.body?.data) {
    return {
      content: Buffer.from(
        message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString(),
      isHTML: message.payload.mimeType === 'text/html'
    }
  }
  return { content: '', isHTML: false }
}

function formatFullMessage(message: GmailMessage): FullMail {
  return {
    ...formatMessage(message),
    ...getContent(message)
  }
}

function formatFrom(from: string | null) {
  if (!from) return null
  for (const pattern of formattableFromPatterns) {
    const match = from.match(pattern)
    if (match) return match[1]
  }
  return from
}

/**
 * Sanitize header values to prevent header injection
 * Removes CR/LF characters
 */
function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]/g, '')
}

function encode(message: { to?: string, subject?: string, content?: string }) {
  const headers = [
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    `Content-Transfer-Encoding: 7bit`
  ]

  if (message.to) {
    headers.push(`to: ${sanitizeHeader(message.to)}`)
  }
  if (message.subject) {
    headers.push(`subject: ${sanitizeHeader(message.subject)}`)
  }

  const sanitizedContent = message.content
    ? sanitizeHeader(message.content)
    : ''
  const emailContent = [...headers, '', sanitizedContent].join('\n')

  // メールメッセージをBase64エンコード
  return Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
