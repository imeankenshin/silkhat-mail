export interface IGmailService {
  getMessages(accessToken: string, options?: GetMessagesOptions): Promise<Result<Mail[], Error>>
}

export interface GetMessagesOptions {
  maxResults?: number
  pageToken?: string
  q?: string // Gmail search query
}
