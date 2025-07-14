<script setup lang="ts">
import { toast } from 'vue-sonner'

// サンプルメールデータ
const { $trpc } = useNuxtApp()
const { data: mails } = useQuery({
  key: ['mails'],
  query: () => $trpc.mails.get.query({})
})
const queryCache = useQueryCache()

const { mutate: toggleStar } = useMutation({
  mutation: (mail: Mail) =>
    $trpc.mails.toggleStar.mutate({
      id: mail.id
    }),

  onMutate(mail) {
    const mails = queryCache.getQueryData<Mail[]>(['mails']) || []
    const mailIndex = mails.findIndex(m => m.id === mail.id)
    let newMails = mails
    if (mailIndex >= 0) {
      newMails = mails.toSpliced(mailIndex, 1, {
        ...mail,
        labels: mail.labels.includes('STARRED') ? [] : ['STARRED']
      })
      queryCache.setQueryData(['mails'], newMails)
    }

    queryCache.cancelQueries({ key: ['mails'], exact: true })

    return { oldMails: mails, newMails }
  },

  onSettled() {
    // always refetch the mails after a mutation
    queryCache.invalidateQueries({ key: ['mails'], exact: true })
  },

  onError(err, mail, { oldMails, newMails }) {
    // oldMails can be undefined if onMutate errors
    if (newMails != null && newMails === queryCache.getQueryData(['mails'])) {
      queryCache.setQueryData(['mails'], oldMails)
    }

    console.error(err)
    toast.error('Unexpected Error')
  }
})

const { mutate: archive } = useMutation({
  mutation: (mail: Mail) =>
    $trpc.mails.archive.mutate({
      id: mail.id
    }),

  onMutate(mail) {
    const mails = queryCache.getQueryData<Mail[]>(['mails']) || []
    const mailIndex = mails.findIndex(m => m.id === mail.id)
    let newMails = mails
    if (mailIndex >= 0) {
      newMails = mails.toSpliced(mailIndex, 1, {
        ...mail,
        labels: mail.labels.includes('STARRED') ? [] : ['ARCHIVED']
      })
      queryCache.setQueryData(['mails'], newMails)
    }

    queryCache.cancelQueries({ key: ['mails'], exact: true })

    return { oldMails: mails, newMails }
  },

  onSettled() {
    // always refetch the mails after a mutation
    queryCache.invalidateQueries({ key: ['mails'], exact: true })
  },

  onError(err, mail, { oldMails, newMails }) {
    // oldMails can be undefined if onMutate errors
    if (newMails != null && newMails === queryCache.getQueryData(['mails'])) {
      queryCache.setQueryData(['mails'], oldMails)
    }

    console.error(err)
    toast.error('Unexpected Error')
  }
})

const { mutate: trash } = useMutation({
  mutation: (mail: Mail) =>
    $trpc.mails.trash.mutate({
      id: mail.id
    }),

  onMutate(mail) {
    const mails = queryCache.getQueryData<Mail[]>(['mails']) || []
    const mailIndex = mails.findIndex(m => m.id === mail.id)
    let newMails = mails
    if (mailIndex >= 0) {
      newMails = mails.filter(m => m.id !== mail.id)
      queryCache.setQueryData(['mails'], newMails)
    }

    queryCache.cancelQueries({ key: ['mails'], exact: true })

    return { oldMails: mails, newMails }
  },

  onSettled() {
    // always refetch the mails after a mutation
    queryCache.invalidateQueries({ key: ['mails'], exact: true })
  },

  onError(err, mail, { oldMails, newMails }) {
    // oldMails can be undefined if onMutate errors
    if (newMails != null && newMails === queryCache.getQueryData(['mails'])) {
      queryCache.setQueryData(['mails'], oldMails)
    }

    console.error(err)
    toast.error('Unexpected Error')
  }
})

// デバッグ用
watchEffect(() => console.log(
  mails.value?.map(m => m.labels)
))
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- メール一覧 -->
    <div
      v-if="mails"
      class="flex-1 overflow-auto"
    >
      <div>
        <div
          v-for="mail in mails"
          :key="mail.id"
          class="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
        >
          <!-- 星アイコン -->
          <UiButton
            variant="ghost"
            size="sm"
            class="h-8 w-8 p-0 hover:bg-transparent"
            @click.stop="toggleStar(mail)"
          >
            <Icon
              :name="mail.labels.includes('STARRED') ? 'material-symbols:star-rounded' : 'material-symbols:star-outline-rounded'"
              :class="mail.labels.includes('STARRED') ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'"
              size="1.5em"
            />
          </UiButton>

          <!-- アバター -->
          <UiAvatar
            :alt="mail.from || ''"
            size="sm"
            class="h-10 w-10 bg-muted"
          />

          <!-- メール情報 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-foreground truncate">
                {{ mail.from }}
              </span>
              <span class="text-muted-foreground truncate">
                {{ mail.subject }}
              </span>
            </div>
          </div>

          <div>
            <UiButton
              variant="ghost"
              size="icon"
              class="h-8 w-8 p-0 hover:bg-transparent"
              @click.stop="archive(mail)"
            >
              <Icon
                class="text-muted-foreground"
                name="material-symbols:archive-rounded"
                size="1.5em"
              />
            </UiButton>
            <UiButton
              variant="ghost"
              size="icon"
              class="h-8 w-8 p-0 hover:bg-transparent"
              @click.stop="trash(mail)"
            >
              <Icon
                class="text-muted-foreground"
                name="material-symbols:delete-rounded"
                size="1.5em"
              />
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
