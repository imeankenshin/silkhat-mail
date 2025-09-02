<script setup lang="ts">
import { useDebounceFn, useEventListener, useUrlSearchParams } from '@vueuse/core'

definePageMeta({
  key: ({ query }) => `mails/${query.is || ''}`
})
// サンプルメールデータ
const { $trpc } = useNuxtApp()
const mailListEl = useTemplateRef('mail-list')
const route = useRoute()
const params = useUrlSearchParams<{
  mailId: string | undefined
  is: string | undefined
}>('history')
const selectedMail = ref<HTMLElement | null>(null)
const { data: mail } = useQuery({
  key: () => ['mail', params.mailId || 'null'],
  query: async () => {
    if (!params.mailId) return null
    return await $trpc.mails.get.query({ id: params.mailId })
  }
})
const { data: mails } = useQuery({
  key: () => ['mails', { is: params.is }],
  query: () => $trpc.mails.list.query(params.is ? { q: `is:${params.is}` } : {})
})

const firstMailEl = computed(() => {
  const first = mailListEl.value?.children[0]
  return first instanceof HTMLElement ? first : null
})
const mailContent = computed(() => {
  if (!mail.value) return null
  if (!mail.value?.isHTML)
    return mail.value?.content ?? ''
  const document = new DOMParser().parseFromString(mail.value.content, 'text/html')
  const style = Array.from(document.querySelectorAll('style')).map(s => s.innerText).join().replaceAll(/body|html/g, ':host')
  document.querySelectorAll('script').forEach(s => s.remove())
  document.querySelectorAll('a').forEach(a => a.target = '_blank')
  return `${style && `<style>${style}</style>`}${document.body.innerHTML}`
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
  if (params.mailId || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  switch (e.key) {
    case 'k':
    case 'ArrowUp': {
      e.preventDefault()
      if (!selectedMail.value) {
        selectedMail.value = firstMailEl.value
        break
      }
      const prev = selectedMail.value.previousElementSibling
      if (prev instanceof HTMLElement) selectedMail.value = prev
      break
    }
    case 'j':
    case 'ArrowDown': {
      e.preventDefault()
      if (!selectedMail.value) {
        selectedMail.value = firstMailEl.value
        break
      }
      const next = selectedMail.value.nextElementSibling
      if (next instanceof HTMLElement) selectedMail.value = next
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
  if (!(selectedMail.value && typeof selectedMail.value.focus === 'function')) return
  selectedMail.value.focus()
})
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- メール一覧 -->
    <UiSheet
      :open="!!params.mailId"
      @update:open="params.mailId = undefined"
    >
      <UiSheetContent class="sm:max-w-2xl overflow-y-auto outline-none">
        <div class="h-full">
          <UiSheetHeader class="pt-12">
            <template v-if="mail">
              <h2 class="text-xl font-bold text-foreground">
                {{ mail.subject }}
              </h2>
              <div>
                <p class="text-muted-foreground">
                  To: {{ mail.to }}
                </p>
                <p class="text-muted-foreground">
                  From: {{ mail.from }}
                </p>
              </div>
            </template>
            <UiSkeleton
              v-else
              class="h-7"
            />
          </UiSheetHeader>
          <UiShadowRoot
            v-if="mailContent"
            class="h-max px-4"
          >
            <div
              style="display: contents;"
              v-html="mailContent"
            />
          </UiShadowRoot>
          <UiSkeleton v-else />
        </div>
      </UiSheetContent>
      <div
        v-if="mails"
        ref="mail-list"
        role="list"
        aria-label="Email list"
        class="flex-1 overflow-auto"
      >
        <div
          v-for="mail in mails"
          :key="mail.id"
          :to="`/mails?id=${mail.id}`"
          role="listitem"
          :aria-selected="params.mailId === mail.id"
          :aria-label="`Email from ${mail.from}: ${mail.subject}`"
          tabindex="-1"
          class="w-full flex outline-none items-center gap-4 p-4 hover:bg-muted/50 focus:bg-muted/50 cursor-pointer"
          @click="params.mailId = mail.id"
          @keydown.enter.space.prevent="params.mailId = mail.id"
          @keydown.s.prevent="toggleStar(mail)"
          @keydown.a.prevent="archive(mail)"
          @keydown.d.prevent="trash(mail)"
        >
          <!-- 星アイコン -->
          <UiButton
            tabindex="-1"
            variant="ghost"
            size="icon"
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
              tabindex="-1"
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
              tabindex="-1"
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
    </UiSheet>
  </div>
</template>
