<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants } from '.'
import { cn } from '@/lib/utils'
import { NuxtLink } from '#components'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  type?: HTMLButtonElement['type']
  icon?: string
  to?: string
}

const isButton = computed(() => props.as === 'button' || !props.to)

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  type: 'button'
})
</script>

<template>
  <Primitive
    data-slot="button"
    :as="to ? NuxtLink : as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :to="to"
    :type="isButton ? type : undefined"
  >
    <Icon
      v-if="icon"
      :name="icon"
      mode="svg"
    />
    <slot />
  </Primitive>
</template>
