export interface IGmailService {
  getMessages(accessToken: string, options?: GetMessagesOptions): Promise<Result<Mail[], Error>>
  toggleStar(accessToken: string, messageId: string): Promise<Result<undefined, Error>>
}

export interface GetMessagesOptions {
  maxResults?: number
  pageToken?: string
  q?: string // Gmail search query
}
