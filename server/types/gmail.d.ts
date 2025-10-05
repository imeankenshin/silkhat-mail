// `googleapis`の代わりにローカルで型を定義
interface GmailMessageHeader {
  name: string
  value: string
}

interface GmailMessageBody {
  attachmentId?: string
  size?: number
  data: string
}

interface GmailMessagePayload {
  headers?: GmailMessageHeader[]
  body?: GmailMessageBody
  parts?: GmailMessagePart[]
  mimeType?: string
  partId?: string
}

interface GmailMessagePart {
  mimeType: string
  body: GmailMessageBody
}

interface GmailMessage {
  id?: string | null
  threadId?: string | null
  snippet?: string | null
  sizeEstimate?: number | null
  labelIds?: string[] | null
  payload?: GmailMessagePayload | null
}

interface GmailDraft {
  id: string
  message?: GmailMessage
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
