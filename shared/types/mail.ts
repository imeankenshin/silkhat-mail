export type Mail = {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: {
      name: string
      value: string
    }[]
  }
  internalDate: string
  sizeEstimate: number
}
