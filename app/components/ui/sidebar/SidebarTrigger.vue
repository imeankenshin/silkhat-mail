<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useSidebar } from './utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <Icon
      name="i-lucide-panel-left"
      class="size-4"
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
