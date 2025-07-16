import { toast } from 'vue-sonner'

export const useMailMutation = <TResult>(
  mutationFn: (mail: Mail) => Promise<TResult>,
  optimisticUpdate: (oldMails: Mail[], mail: Mail, mailIndex: number) => Mail[],
  errorMessage: string
) => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: mutationFn,
    onMutate(mail) {
      const mails = queryCache.getQueryData<Mail[]>(['mails']) || []
      const mailIndex = mails.findIndex(m => m.id === mail.id)
      if (mailIndex >= 0) {
        const newMails = optimisticUpdate(mails, mail, mailIndex)
        queryCache.setQueryData(['mails'], newMails)
        return { oldMails: mails, newMails }
      }
      queryCache.cancelQueries({ key: ['mails'], exact: true })
      return { oldMails: mails, newMails: null }
    },
    onSettled() {
      queryCache.invalidateQueries({ key: ['mails'], exact: true })
    },
    onError(err, mail, { oldMails, newMails }) {
      if (newMails != null && newMails === queryCache.getQueryData(['mails'])) {
        queryCache.setQueryData(['mails'], oldMails)
      }
      console.error(err)
      toast.error(errorMessage)
    }
  })
}
