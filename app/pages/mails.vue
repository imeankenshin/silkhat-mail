<script setup lang="ts">
import { useDebounceFn, useEventListener, useUrlSearchParams } from '@vueuse/core'
import MailView from '~/components/app/MailView.vue'

definePageMeta({
  key: ({ query }) => `mails/${query.is || ''}`
})
// サンプルメールデータ
const { $trpc } = useNuxtApp()
const selectedMail = useSelectedMailStore()
const mailListEl = useTemplateRef('mail-list')
const route = useRoute()
const params = useUrlSearchParams<{
  mailId: string | undefined
  is: string | undefined
}>('history')
const selectedMailEl = ref<HTMLElement | null>(null)

const { data: mails } = useQuery({
  key: () => ['mails', { is: params.is }],
  query: () => $trpc.mails.list.query(params.is ? { q: `is:${params.is}` } : {})
})

const firstMailEl = computed(() => {
  const first = mailListEl.value?.children[0]
  return first instanceof HTMLElement ? first : null
})

const debounceToggleStar = useDebounceFn(async (mail: Mail) => {
  return $trpc.mails.toggleStar.mutate({ id: mail.id, value: !isStarred(mail) })
},
3000)

const { mutate: toggleStar } = useMailMutation(
  debounceToggleStar,
  (mails, mail, mailIndex) =>
    mails.toSpliced(mailIndex, 1,
      toStarToggled(mail)
    ),
  'Failed to toggle star'
)

const { mutate: archive } = useMailMutation(
  (mail: Mail) =>
    $trpc.mails.archive.mutate({
      id: mail.id
    }),
  (mails, mail) => mails.filter(m => !isSameMail(m, mail)),
  'Failed to archive mail')

const { mutate: trash } = useMailMutation(
  (mail: Mail) =>
    $trpc.mails.trash.mutate({
      id: mail.id
    }),
  (mails, mail) => mails.filter(m => !isSameMail(m, mail)),
  'Failed to trash mail'
)

useEventListener('keydown', (e) => {
  if (selectedMail.mail || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  switch (e.key) {
    case 'k':
    case 'ArrowUp': {
      e.preventDefault()
      if (!selectedMailEl.value) {
        selectedMailEl.value = firstMailEl.value
        break
      }
      const prev = selectedMailEl.value.previousElementSibling
      if (prev instanceof HTMLElement) selectedMailEl.value = prev
      break
    }
    case 'j':
    case 'ArrowDown': {
      e.preventDefault()
      if (!selectedMailEl.value) {
        selectedMailEl.value = firstMailEl.value
        break
      }
      const next = selectedMailEl.value.nextElementSibling
      if (next instanceof HTMLElement) selectedMailEl.value = next
      break
    }
  }
})

onBeforeRouteUpdate((to) => {
  params.mailId = to.query.id as string | undefined
})

onMounted(() => {
  if (!params.mailId && typeof route.query.id === 'string') {
    params.mailId = route.query.id
  }
})

watchEffect(() => {
  if (selectedMailEl.value && typeof selectedMailEl.value.focus === 'function')
    selectedMailEl.value.focus()
})
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- メール一覧 -->
    <MailView />
    <div
      v-if="mails"
      ref="mail-list"
      role="list"
      aria-label="Email list"
      class="flex-1 overflow-auto"
    >
      <AppMailItem
        v-for="mail in mails"
        :key="mail.id"
        :mail="mail"
        @toggle-star="toggleStar(mail)"
        @archive="archive(mail)"
        @trash="trash(mail)"
      />
    </div>
  </div>
</template>
