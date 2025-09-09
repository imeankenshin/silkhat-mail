<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false
})

defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Motion
    as="svg"
    :class="cn('fill-foreground', $props.class)"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
    :animate="{
      rotate: [180, 0, 180],
      transition: {
        duration: 0.6,
        times: [0, 0, 1],
        delay: 0.6,
        repeatDelay: 0.6,
        repeat: Infinity
      }
    }"
  >
    <path
      d="M16 4H8V7C8 8.1 8.39166 9.04167 9.175 9.825C9.95833 10.6083 10.9 11 12 11C13.1 11 14.0417 10.6083 14.825 9.825C15.6083 9.04167 16 8.1 16 7V4ZM12 13C10.9 13 9.95833 13.3917 9.175 14.175C8.39166 14.9583 8 15.9 8 17V20H16V17C16 15.9 15.6083 14.9583 14.825 14.175C14.0417 13.3917 13.1 13 12 13ZM19 2C19.2833 2 19.5207 2.096 19.712 2.288C19.9033 2.48 19.9993 2.71733 20 3C20.0007 3.28267 19.9047 3.52 19.712 3.712C19.5193 3.904 19.282 4 19 4H18V7C18 8.01667 17.7623 8.971 17.287 9.863C16.8117 10.755 16.1493 11.4673 15.3 12C16.15 12.5333 16.8123 13.2457 17.287 14.137C17.7617 15.0283 17.9993 15.9827 18 17V20H19C19.2833 20 19.5207 20.096 19.712 20.288C19.9033 20.48 19.9993 20.7173 20 21C20.0007 21.2827 19.9047 21.52 19.712 21.712C19.5193 21.904 19.282 22 19 22H5C4.71666 22 4.479 21.904 4.287 21.712C4.095 21.52 3.99933 21.2827 4 21C4.00066 20.7173 4.09666 20.4797 4.288 20.287C4.47933 20.0943 4.71666 19.9987 5 20H6V17C6 15.9833 6.23733 15.029 6.712 14.137C7.18666 13.245 7.84933 12.5327 8.7 12C7.85 11.4667 7.18733 10.754 6.712 9.862C6.23666 8.97 5.99933 8.016 6 7V4H5C4.71666 4 4.479 3.904 4.287 3.712C4.095 3.52 3.99933 3.28267 4 3C4.00066 2.71733 4.09666 2.47967 4.288 2.287C4.47933 2.09433 4.71666 1.99867 5 2H19Z"
    />
    <Motion
      as="rect"
      class="sand-up"
      x="7.875"
      y="4"
      width="8.25"
      :animate="{
        height: [0, 7.25, 0],
        transition: {
          times: [0, 1, 1],
          duration: 0.6,
          repeatDelay: 0.6,
          repeat: Infinity
        }
      }"
    />
    <Motion
      as="rect"
      class="sand-down"
      x="7.875"
      y="13"
      width="8.25"
      height="7.25"
      :animate="{
        height: [7.25, 0, 7.25],
        transition: {
          times: [0, 1, 1],
          duration: 0.6,
          repeatDelay: 0.6,
          repeat: Infinity
        }
      }"
    />
  </Motion>
</template>
