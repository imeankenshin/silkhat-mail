import { AsyncLocalStorage } from 'node:async_hooks'
import { createContext } from 'unctx'
import type { User, UserSession } from '~~/types/auth'

export const { use: useSession, call: provideSession } = createContext<{
  session: UserSession
  user: User
}>({
  asyncContext: true,
  AsyncLocalStorage
})

export const { use: useGoogleAccessToken, call: provideGoogleAccessToken } = createContext<string>({
  asyncContext: true,
  AsyncLocalStorage
})
