<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'reka-ui'
import { avatarVariants, type AvatarVariants } from '.'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  src?: string | null
  size?: AvatarVariants['size']
  alt?: string
}>()
</script>

<template>
  <AvatarRoot
    data-slot="avatar"
    :class="cn(avatarVariants({ size: props.size }), props.class)"
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
