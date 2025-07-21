import { AsyncLocalStorage } from 'node:async_hooks'
import { createContext } from 'unctx'
import type { User, UserSession } from '~~/types/auth'

export type UserContext = {
  session: UserSession
  user: User
}

export const {
  use: useUser,
  call: provideUser
} = createContext<UserContext>({
  asyncContext: true,
  AsyncLocalStorage
})
