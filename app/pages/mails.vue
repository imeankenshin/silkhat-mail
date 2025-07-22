<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

// サンプルメールデータ
const { $trpc } = useNuxtApp()
const { data: mails } = useQuery({
  key: ['mails'],
  query: () => $trpc.mails.list.query({})
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
