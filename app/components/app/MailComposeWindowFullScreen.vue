<script setup lang="ts">
import { DialogPortal, DialogContent } from 'reka-ui'

defineProps<{
  windowName: string
}>()

defineEmits<{
  (e: 'minimize' | 'close' | 'close-fullscreen'): void
}>()

const open = defineModel<boolean>('open', {
  default: false
})
</script>

<template>
  <UiDialog
    v-model:open="open"
  >
    <DialogPortal>
      <UiDialogOverlay class="duration-0" />
      <DialogContent
        data-slot="dialog-content"
        class="bg-background fixed top-[50%] left-[50%] z-50 flex flex-col w-[calc(100%-3rem)] max-w-4xl max-h-[calc(100%-3rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-4 shadow-lg"
        @pointer-down-outside="(event) => {
          const originalEvent = event.detail.originalEvent;
          const target = originalEvent.target as HTMLElement;
          if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
            event.preventDefault();
          }
        }"
      >
        <UiDialogHeader>
          <div class="flex justify-between items-center h-fit">
            <span
              :title="windowName"
              class="whitespace-nowrap overflow-hidden text-ellipsis min-w-xs"
            >
              {{ windowName || "New message" }}
            </span>
            <div class="flex">
              <UiButton
                size="icon"
                variant="ghost"
                @click.prevent="$emit('minimize')"
              >
                <Icon name="material-symbols:minimize-rounded" />
              </UiButton>
              <UiButton
                size="icon"
                variant="ghost"
                @click.prevent="open = false"
              >
                <Icon name="material-symbols:close-fullscreen-rounded" />
              </UiButton>
              <UiButton
                size="icon"
                variant="ghost"
                @click.prevent="$emit('close')"
              >
                <Icon name="material-symbols:close-rounded" />
              </UiButton>
            </div>
          </div>
        </UiDialogHeader>
        <slot />
      </DialogContent>
    </DialogPortal>
  </UiDialog>
</template>
