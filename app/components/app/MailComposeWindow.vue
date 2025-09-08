<script setup lang="ts">
import { debouncedWatch } from '@vueuse/core'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { $trpc } = useNuxtApp()

const windowSize = ref<'normal' | 'minimized' | 'opened-in-full'>('normal')

const to = ref('')
const subject = ref('')
const content = ref('')
const draftId = ref<string | null>(null)

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

const { mutate: save, status: saveStatus, asyncStatus: saveAsyncStatus, reset: resetSave } = useMutation({
  mutation: () =>
    draftId.value
      ? $trpc.drafts.update.mutate({
          draftId: draftId.value,
          to: to.value,
          subject: subject.value,
          content: content.value
        })
      : $trpc.drafts.create.mutate({
          to: to.value,
          subject: subject.value,
          content: content.value
        }),
  onSuccess(draft) {
    draftId.value = draft.id
  },
  onError(err) {
    console.error(err)
    toast.error('Failed to save mail')
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

debouncedWatch([to, subject, content], () => {
  save()
}, {
  debounce: 1600
})

debouncedWatch(saveStatus, () => {
  if (saveStatus.value !== 'pending') resetSave()
}, {
  debounce: 6000
})

onBeforeUnmount(() => {
  if ((to.value || subject.value || content.value) || saveStatus.value === 'success') save()
})
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
    @keydown.escape.prevent="emit('close')"
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
          <Icon
            :name="openedInFull ? 'material-symbols:close-fullscreen-rounded' : 'material-symbols:open-in-full-rounded'"
          />
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
      <div class="flex justify-between">
        <UiButton
          type="submit"
          :disabled="isLoading || !to"
        >
          <Icon name="material-symbols:send-rounded" />
          Send
        </UiButton>
        <div
          v-if="saveAsyncStatus === 'loading'"
          class="flex items-center gap-2"
        >
          <UiLoadingIndicator class="size-5" />
          <span class="text-xs">Saving the progress...</span>
        </div>
        <div
          v-else-if="saveStatus === 'error'"
          class="flex items-center gap-2"
        >
          <Icon name="material-symbols:error-rounded" />
          <span class="text-xs">Failed to save the progress</span>
        </div>
        <div
          v-else-if="saveStatus === 'success'"
          class="flex items-center gap-2 text-emerald-500"
        >
          <Icon name="material-symbols:check-rounded" />
          <span class="text-xs">Saved as a draft</span>
        </div>
      </div>
    </div>
  </form>

  <!-- 全画面ダイアログ表示 -->
  <AppMailComposeWindowFullScreen
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
          :disabled="isLoading || !to"
        >
          <Icon name="material-symbols:send-rounded" />
          Send
        </UiButton>
        <div
          v-if="saveAsyncStatus === 'loading'"
          class="flex items-center gap-2"
        >
          <UiLoadingIndicator class="size-5" />
          <span class="text-xs">Saving the progress...</span>
        </div>
        <div
          v-else-if="saveStatus === 'error'"
          class="flex items-center gap-2"
        >
          <Icon name="material-symbols:error-rounded" />
          <span class="text-xs">Failed to save the progress</span>
        </div>
        <div
          v-else-if="saveStatus === 'success'"
          class="flex items-center gap-2 text-emerald-500"
        >
          <Icon name="material-symbols:check-rounded" />
          <span class="text-xs">Saved as a draft</span>
        </div>
      </div>
    </form>
  </AppMailComposeWindowFullScreen>
</template>
