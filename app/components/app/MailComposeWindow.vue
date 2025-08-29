<script setup lang="ts">
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { $trpc } = useNuxtApp()

const windowSize = ref<'normal' | 'minimized' | 'opened-in-full'>('normal')

const to = ref('')
const subject = ref('')
const content = ref('')

const minimized = computed({
  get: () => windowSize.value === 'minimized',
  set: (value: boolean) => {
    windowSize.value = value ? 'minimized' : 'normal'
  }
})
const openedInFull = computed({
  get: () => windowSize.value === 'opened-in-full',
  set: (value: boolean) => {
    windowSize.value = value ? 'opened-in-full' : 'normal'
  }
})

const { mutate: send, isLoading } = useMutation({
  mutation: () => {
    return $trpc.mails.send.mutate({
      to: to.value,
      subject: subject.value,
      content: content.value
    })
  },
  onError(err) {
    console.error(err)
    toast.error('Failed to send mail')
  }
})

const focusTo = (event: KeyboardEvent, target: 'first' | 'last' = 'first') => {
  if (!(event.currentTarget instanceof HTMLElement)) return
  const focusableEls = event.currentTarget.querySelectorAll('input, textarea, button')
  const first = focusableEls?.[0]
  const last = focusableEls?.[focusableEls.length - 1]
  const expected = target === 'first' ? last : first
  const el = target === 'first' ? first : last
  if (document.activeElement !== expected) return
  event.preventDefault()
  if (el instanceof HTMLElement) el.focus()
}
</script>

<template>
  <!-- 通常表示（ダイアログではない） -->
  <form
    v-show="!openedInFull"
    class="bg-card text-card-foreground max-w-xl w-full shrink-0 border-1 border-border rounded rounded-b-none border-b-0 data-[minimized]:w-fit"
    :data-minimized="minimized ? '' : undefined"
    @submit.prevent="send()"
    @keydown.tab.exact="focusTo($event)"
    @keydown.tab.shift="focusTo($event, 'last')"
    @keydown.exact.stop
  >
    <div class="flex items-center px-3 py-3 justify-between">
      <span
        :title="subject"
        class="whitespace-nowrap overflow-hidden text-ellipsis min-w-xs"
      >
        {{ subject || "New message" }}
      </span>
      <div class="flex">
        <UiButton
          size="icon"
          variant="ghost"
          @click="minimized = !minimized"
        >
          <Icon :name="minimized ? 'material-symbols:maximize-rounded' : 'material-symbols:minimize-rounded'" />
        </UiButton>
        <UiButton
          size="icon"
          variant="ghost"
          @click="openedInFull = !openedInFull"
        >
          <Icon :name="openedInFull ? 'material-symbols:close-fullscreen-rounded' : 'material-symbols:open-in-full-rounded'" />
        </UiButton>
        <UiButton
          size="icon"
          variant="ghost"
          @click="emit('close')"
        >
          <Icon name="material-symbols:close-rounded" />
        </UiButton>
      </div>
    </div>
    <div
      v-show="!minimized"
      class="px-3 pb-3 grid gap-3"
    >
      <div class="flex flex-col space-y-1.5">
        <UiLabel for="to">
          To
        </UiLabel>
        <UiInput
          v-model="to"
          name="to"
        />
      </div>
      <div class="flex flex-col space-y-1.5">
        <UiLabel for="subject">
          Subject
        </UiLabel>
        <UiInput
          v-model="subject"
          name="subject"
        />
      </div>
      <div class="flex flex-col space-y-1.5">
        <UiLabel for="content">
          Content
        </UiLabel>
        <UiTextarea
          v-model="content"
          name="content"
          class="w-full min-h-40"
        />
      </div>
      <div class="flex">
        <UiButton
          type="submit"
          :disabled="isLoading"
        >
          <Icon name="material-symbols:send-rounded" />
          Send
        </UiButton>
      </div>
    </div>
  </form>

  <!-- 全画面ダイアログ表示 -->
  <AppMailComposeWIndowFullScreen
    v-model:open="openedInFull"
    :window-name="subject"
    @close="openedInFull = false"
    @minimize="minimized = true"
  >
    <form
      class="flex flex-col gap-4 h-full *:min-w-0"
      @submit.prevent="send()"
      @keydown.tab.exact="focusTo($event)"
      @keydown.tab.shift="focusTo($event, 'last')"
    >
      <div class="flex flex-col space-y-2">
        <UiLabel for="to-fullscreen">
          To
        </UiLabel>
        <UiInput
          id="to-fullscreen"
          v-model="to"
          name="to"
          class="w-full"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <UiLabel for="subject-fullscreen">
          Subject
        </UiLabel>
        <UiInput
          id="subject-fullscreen"
          v-model="subject"
          name="subject"
          class="w-full"
        />
      </div>
      <div class="flex flex-col space-y-2 h-full">
        <UiLabel for="content-fullscreen">
          Content
        </UiLabel>
        <UiTextarea
          id="content-fullscreen"
          v-model="content"
          name="content"
          class="w-full h-full resize-y"
        />
      </div>
      <div class="flex justify-between">
        <UiButton
          type="submit"
          :disabled="isLoading"
        >
          <Icon name="material-symbols:send-rounded" />
          Send
        </UiButton>
      </div>
    </form>
  </AppMailComposeWIndowFullScreen>
</template>
