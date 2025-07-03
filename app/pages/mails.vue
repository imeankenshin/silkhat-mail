<script setup lang="ts">
// サンプルメールデータ
const mails = ref([
  {
    id: 1,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 2,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 3,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 4,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 5,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 6,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 7,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 8,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 9,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 10,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 11,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 12,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  },
  {
    id: 13,
    sender: 'ツジ 佐介',
    subject: '今夜の社交ダンスについて',
    isStarred: false,
    avatar: null
  }
])

const toggleStar = (mailId: number) => {
  const mail = mails.value.find(m => m.id === mailId)
  if (mail) {
    mail.isStarred = !mail.isStarred
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- メール一覧 -->
    <div class="flex-1 overflow-auto">
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
              :name="mail.isStarred ? 'material-symbols:star-rounded' : 'material-symbols:star-outline-rounded'"
              :class="mail.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'"
              size="1.5em"
            />
          </UiButton>

          <!-- アバター -->
          <UiAvatar
            :src="mail.avatar"
            :alt="mail.sender"
            size="sm"
            class="h-10 w-10 bg-muted"
          />

          <!-- メール情報 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-foreground truncate">
                {{ mail.sender }}
              </span>
              <span class="text-muted-foreground truncate">
                {{ mail.subject }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
