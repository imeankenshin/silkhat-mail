<script setup lang="ts">
const props = defineProps<{
  mail: Mail
}>()

const emit = defineEmits<{
  (e: 'toggle-star' | 'archive' | 'trash'): void
}>()

const { mailId, select } = useSelectedMail()
const isSelected = computed(() => mailId.value === props.mail.id)
</script>

<template>
  <div
    :key="mail.id"
    :to="`/mails?id=${mail}`"
    role="listitem"
    :aria-selected="isSelected"
    :aria-label="`Email from ${mail.from}: ${mail.subject}`"
    :data-read="isRead(mail)"
    tabindex="-1"
    class="w-full group flex gap-3 outline-none items-center px-4 h-16 hover:bg-muted/50 focus:bg-muted/50 cursor-pointer data-[read=true]:text-muted-foreground"
    @click="select(mail.id)"
    @keydown.enter.space.prevent="select(mail.id)"
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

    <!-- メール情報 -->
    <span class="font-medium text-sm truncate text-unwrap w-44 shrink-0 ml-3">
      {{ mail.from }}
    </span>
    <div class="flex w-full gap-2 min-w-0">
      <span class="text-sm truncate w-min">
        {{ mail.subject }}
      </span>
      <span class="text-muted-foreground text-sm truncate flex-1">
        {{ mail.snippet.replaceAll('\u200d', ' ').trim() }}
      </span>
    </div>

    <div
      v-if="mail.date"
      class="group-hover:hidden group-focus:hidden mx-2"
    >
      <time
        :datetime="mail.date"
        :data-read="isRead(mail)"
        class="data-[read=false]:font-semibold w-16 text-sm whitespace-nowrap text-end"
      >
        {{ formatDate(mail.date) }}
      </time>
    </div>
    <div class="group-hover:flex group-focus:flex hidden">
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
