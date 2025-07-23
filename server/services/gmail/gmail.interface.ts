export interface IGmailService {
  listMessages(accessToken: string, options?: GetMessagesOptions): Promise<Result<Mail[], Error>>
  toggleStar(accessToken: string, messageId: string, isStarred: boolean): Promise<Result<undefined, Error>>
  archive(accessToken: string, messageId: string): Promise<Result<undefined, Error>>
  trash(accessToken: string, messageId: string): Promise<Result<undefined, Error>>
}

export interface GetMessagesOptions {
  maxResults?: number
  pageToken?: string
  q?: string // Gmail search query
}
