import { useUrlSearchParams } from '@vueuse/core'

export const useSelectedMailStore = defineStore('selected-mail', () => {
  const params = useUrlSearchParams<{
    mailId: string | undefined
  }>('history')

  return {
    mailId: params.mailId,
    select: (id: Mail['id']) => {
      params.mailId = id
    },
    unselect: () => {
      params.mailId = undefined
    }
  }
})
