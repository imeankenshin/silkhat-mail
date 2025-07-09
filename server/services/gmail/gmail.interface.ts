export interface IGmailService {
  getMessages(accessToken: string, options?: GetMessagesOptions): Promise<Result<GmailMessage[], Error>>
}

export interface GetMessagesOptions {
  maxResults?: number
  pageToken?: string
  q?: string // Gmail search query
}

export interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: Array<{
      name: string
      value: string
    }>
  }
  internalDate: string
  sizeEstimate: number
}

export interface GmailMessageHeader {
  name: string
  value: string
}
