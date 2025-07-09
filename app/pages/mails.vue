<script setup lang="ts">
// サンプルメールデータ
const { $trpc } = useNuxtApp()
const { data: mails, error } = $trpc.mails.get.useQuery({})

const toggleStar = (mailId: string) => {
  const mail = mails.value?.find(m => m.id === mailId)
  if (mail) {
    // TODO: スターを変更する
  }
}

// デバッグ用
watchEffect(() => console.log(
  error.value
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
            @click.stop="toggleStar(mail.id)"
          >
            <Icon
              :name="false ? 'material-symbols:star-rounded' : 'material-symbols:star-outline-rounded'"
              :class="false ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'"
              size="1.5em"
            />
          </UiButton>

          <!-- アバター -->
          <UiAvatar
            :alt="mail.payload.headers.find(h => h.name === 'From')?.value"
            size="sm"
            class="h-10 w-10 bg-muted"
          />

          <!-- メール情報 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-foreground truncate">
                {{ mail.payload.headers.find(h => h.name === 'From')?.value }}
              </span>
              <span class="text-muted-foreground truncate">
                {{ mail.payload.headers.find(h => h.name === 'Subject')?.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
