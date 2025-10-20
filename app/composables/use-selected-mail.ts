import { useUrlSearchParams } from '@vueuse/core'

export function useSelectedMail() {
  const params = useUrlSearchParams<{
    mailId: string | undefined
  }>()

  const mailId = useState<string | undefined>('mailId', () => undefined)
  watchEffect(() => {
    mailId.value = params.mailId
  })

  return {
    mailId,
    select: (id: Mail['id']) => {
      mailId.value = id
    },
    unselect: () => {
      mailId.value = undefined
    }
  }
}
