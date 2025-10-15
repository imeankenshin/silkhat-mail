<script setup lang="ts">
const props = defineProps<{
  mail: Mail
}>()

const emit = defineEmits<{
  (e: 'toggle-star' | 'archive' | 'trash'): void
}>()

const selectedMail = useSelectedMailStore()
const isSelected = computed(() => !!(selectedMail.mail && isSameMail(selectedMail.mail, props.mail)))
</script>

<template>
  <div
    :key="mail.id"
    :to="`/mails?id=${mail.id}`"
    role="listitem"
    :aria-selected="isSelected"
    :aria-label="`Email from ${mail.from}: ${mail.subject}`"
    tabindex="-1"
    class="w-full flex outline-none items-center gap-4 p-4 hover:bg-muted/50 focus:bg-muted/50 cursor-pointer"
    @click="selectedMail.select(mail)"
    @keydown.enter.space.prevent="selectedMail.select(mail)"
    @keydown.s.prevent="emit('toggle-star')"
    @keydown.a.prevent="emit('archive')"
    @keydown.d.prevent="emit('trash')"
  >
    <!-- 星アイコン -->
    <UiButton
      tabindex="-1"
      variant="ghost"
      size="icon"
      @click.stop="emit('toggle-star')"
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
        @click.stop="emit('archive')"
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
        @click.stop="emit('trash')"
      >
        <Icon
          class="text-muted-foreground"
          name="material-symbols:delete-rounded"
          size="1.5em"
        />
      </UiButton>
    </div>
  </div>
</template>
