<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        props.class
      )
    "
  >
    <UiCardHeader class="flex justify-between">
      <slot name="header" />
    </UiCardHeader>
    <UiCardContent>
      <slot />
    </UiCardContent>
    <UiCardFooter>
      <slot name="footer" />
    </UiCardFooter>
  </div>
</template>
