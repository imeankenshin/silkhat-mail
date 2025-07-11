export type Mail = {
  id: string
  threadId: string
  snippet: string
  from: string | null
  to: string | null
  subject: string | null
  date: string | null
  sizeEstimate: number
  labels: string[]
}
