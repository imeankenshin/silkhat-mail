<script setup lang="ts">
// サンプルメールデータ
const mails = ref([
  {
    id: 1,
    sender: 'りんご銀行',
    subject: 'デビットカードご利用のお知らせ',
    isStarred: false,
    avatar: null,
    date: '2024-07-01T10:00:00Z'
  },
  {
    id: 2,
    sender: 'Apple Bank',
    subject: 'Debit Card Usage Notification',
    isStarred: true,
    avatar: null,
    date: '2024-07-01T11:30:00Z'
  },
  {
    id: 3,
    sender: '田中商店',
    subject: 'ご注文ありがとうございます',
    isStarred: false,
    avatar: null,
    date: '2024-07-02T09:15:00Z'
  },
  {
    id: 4,
    sender: 'Tanaka Store',
    subject: 'Thank you for your order',
    isStarred: false,
    avatar: null,
    date: '2024-07-02T14:00:00Z'
  },
  {
    id: 5,
    sender: 'サポートチーム',
    subject: 'パスワードリセットのご案内',
    isStarred: true,
    avatar: null,
    date: '2024-07-03T16:45:00Z'
  },
  {
    id: 6,
    sender: 'Support Team',
    subject: 'Password Reset Instructions',
    isStarred: false,
    avatar: null,
    date: '2024-07-03T17:00:00Z'
  },
  {
    id: 7,
    sender: 'ニュースレター',
    subject: '今週の注目記事',
    isStarred: false,
    avatar: null,
    date: '2024-07-04T08:00:00Z'
  },
  {
    id: 8,
    sender: 'Newsletter',
    subject: 'This Week\'s Featured Articles',
    isStarred: false,
    avatar: null,
    date: '2024-07-04T08:30:00Z'
  },
  {
    id: 9,
    sender: 'イベント事務局',
    subject: 'イベント参加登録完了のお知らせ',
    isStarred: true,
    avatar: null,
    date: '2024-07-04T10:00:00Z'
  },
  {
    id: 10,
    sender: 'Event Secretariat',
    subject: 'Event Registration Confirmation',
    isStarred: false,
    avatar: null,
    date: '2024-07-04T10:15:00Z'
  },
  {
    id: 11,
    sender: '人事部',
    subject: '月次報告書提出のお願い',
    isStarred: false,
    avatar: null,
    date: '2024-07-05T09:00:00Z'
  },
  {
    id: 12,
    sender: 'HR Department',
    subject: 'Monthly Report Submission Request',
    isStarred: false,
    avatar: null,
    date: '2024-07-05T09:30:00Z'
  },
  {
    id: 13,
    sender: 'システム管理者',
    subject: 'システムメンテナンスのお知らせ',
    isStarred: true,
    avatar: null,
    date: '2024-07-05T11:00:00Z'
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
