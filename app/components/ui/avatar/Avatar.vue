<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  src?: string | null
  alt?: string
}>()
</script>

<template>
  <AvatarRoot
    data-slot="avatar"
    :class="cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', props.class)"
  >
    <slot />
    <UiAvatarImage
      v-if="src"
      :src="src"
      :alt="alt"
    />
    <UiAvatarFallback v-else>
      {{ alt?.charAt(0) }}
    </UiAvatarFallback>
  </AvatarRoot>
</template>
