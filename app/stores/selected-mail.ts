import { useUrlSearchParams } from '@vueuse/core'

export const useSelectedMailStore = defineStore('selected-mail', () => {
  const selectedMail = ref<Mail | undefined>(undefined)
  const params = useUrlSearchParams<{
    mailId: string | undefined
    is: string | undefined
  }>('history')

  watchEffect(() => {
    params.mailId = selectedMail.value?.id
  })

  return {
    mail: selectedMail,
    select: (mail: Mail) => {
      selectedMail.value = mail
    },
    unselect: () => {
      selectedMail.value = undefined
    }
  }
})
