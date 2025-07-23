<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

// サンプルメールデータ
const { $trpc, $router } = useNuxtApp()
const route = useRoute()
const selectedMailId = ref(route.query.id as string | undefined)
const { data: mail } = useQuery({
  key: () => ['mail', selectedMailId.value || 'null'],
  query: async () => {
    if (!selectedMailId.value) return null
    return await $trpc.mails.get.query({ id: selectedMailId.value as string })
  }
})
const { data: mails } = useQuery({
  key: ['mails'],
  query: () => $trpc.mails.list.query({})
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

onBeforeRouteUpdate((to) => {
  selectedMailId.value = to.query.id as string | undefined
})

watchEffect(() => {
  $router.push(selectedMailId.value ? `/mails?id=${selectedMailId.value}` : '/mails')
})
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- メール一覧 -->
    <UiSheet
      :open="!!selectedMailId"
      @update:open="selectedMailId = undefined"
    >
      <UiSheetContent class="sm:max-w-[600px]">
        <div class="h-full overflow-y-auto">
          <UiSheetHeader class="pt-12">
            <UiSkeleton
              v-if="!mail"
              class="h-7"
            />
            <template v-else>
              <h2 class="text-xl font-bold text-foreground">
                {{ mail.subject }}
              </h2>
              <p class="text-muted-foreground">
                To: {{ mail.to }}
              </p>
              <p class="text-muted-foreground">
                From: {{ mail.from }}
              </p>
            </template>
          </UiSheetHeader>
          <UiShadowRoot
            v-if="mailContent"
            class="h-max-content"
          >
            <div v-html="mailContent" />
          </UiShadowRoot>
          <UiSkeleton v-else />
        </div>
      </UiSheetContent>
      <div
        v-if="mails"
        class="flex-1 overflow-auto"
      >
        <div>
          <button
            v-for="mail in mails"
            :key="mail.id"
            :to="`/mails?id=${mail.id}`"
            class="w-full flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            @click="selectedMailId = mail.id"
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
          </button>
        </div>
      </div>
    </UiSheet>
  </div>
</template>
