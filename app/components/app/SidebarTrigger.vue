<script setup lang="ts">
import { useSidebar } from '../ui/sidebar'

defineProps<{
  showOn: 'open' | 'closed'
}>()

const { open } = useSidebar()
</script>

<template>
  <Motion
    is="div"
    v-if="showOn === 'open' ? open : !open"
    :transition="{
      ease: [0.2, 0.0, 0, 1.0],
      duration: 0.4
    }"
    class="inline-grid place-items-center size-9 backdrop-blur rounded-lg"
    layout-id="sidebar-toggle"
  >
    <UiSidebarTrigger />
  </Motion>
</template>
