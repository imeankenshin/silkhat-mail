<script setup lang="ts">
const el = useTemplateRef('el')
const shadowRoot = ref<ShadowRoot>()

onMounted(() => {
  shadowRoot.value = el.value?.attachShadow({ mode: 'open' })
})
</script>

<template>
  <Teleport
    v-if="shadowRoot"
    :to="shadowRoot"
  >
    <slot />
  </Teleport>
  <div
    v-bind="$attrs"
    ref="el"
  />
</template>
