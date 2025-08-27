<script setup lang="ts">
import { toast } from 'vue-sonner'

defineEmits<{
  (e: 'close'): void
}>()

const { $trpc } = useNuxtApp()

const minimized = ref(false)
const windowName = ref('')

const { mutate: send, isLoading } = useMutation({
  mutation: (event: Event) => {
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    return $trpc.mails.send.mutate({
      to: formData.get('to') as string,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string
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
  <form
    class="bg-card text-card-foreground max-w-xl w-full fixed bottom-0 right-16 border-1 border-border rounded rounded-b-none border-b-0"
    @submit.prevent="send($event)"
    @keydown.tab.exact="focusTo($event)"
    @keydown.tab.shift="focusTo($event, 'last')"
    @keydown.exact.stop
  >
    <div class="flex items-center px-3 py-3 justify-between">
      <span
        :title="windowName"
        class="whitespace-nowrap overflow-hidden text-ellipsis"
      >{{ windowName || "New message" }}</span>
      <div class="flex">
        <UiButton
          size="icon"
          variant="ghost"
          @click="minimized = !minimized"
        >
          <Icon name="material-symbols:minimize-rounded" />
        </UiButton>
        <UiButton
          size="icon"
          variant="ghost"
        >
          <Icon name="material-symbols:open-in-full-rounded" />
        </UiButton>
        <UiButton
          size="icon"
          variant="ghost"
          @click="$emit('close')"
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
        <UiInput name="to" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <UiLabel for="subject">
          Subject
        </UiLabel>
        <UiInput
          v-model="windowName"
          name="subject"
        />
      </div>
      <div class="flex flex-col space-y-1.5">
        <UiLabel for="content">
          Content
        </UiLabel>
        <UiTextarea
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
</template>
