// `googleapis`の代わりにローカルで型を定義
interface GmailMessageHeader {
  name: string
  value: string
}

interface GmailMessagePayload {
  headers?: GmailMessageHeader[]
}

interface GmailMessage {
  id?: string | null
  threadId?: string | null
  snippet?: string | null
  sizeEstimate?: number | null
  labelIds?: string[] | null
  payload?: GmailMessagePayload | null
}

interface ListMessagesResponse {
  messages?: { id?: string | null }[]
  nextPageToken?: string | null
  resultSizeEstimate?: number | null
}

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token?: string
}
