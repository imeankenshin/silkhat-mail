<script setup lang="ts">
const props = defineProps<{
  mail: FullMail
}>()

const mailContent = computed(() => {
  if (!props.mail.isHTML)
    return props.mail?.content.replaceAll('\n', '<br>') ?? ''
  const document = new DOMParser().parseFromString(props.mail.content, 'text/html')
  const style = Array.from(document.querySelectorAll('style')).map(s => `<style>${s.innerText.replaceAll(/body|html/g, ':host')}</style>`).join('')
  document.querySelectorAll<HTMLElement>('*').forEach((el) => {
    // if the element has a background color, set the text color to black
    // because most of the time, the background color is white-ish
    if (el.style.background) {
      el.style.color ||= '#000'
    }
  })
  document.querySelectorAll('script').forEach(s => s.remove())
  document.querySelectorAll('a').forEach(a => a.target = '_blank')
  return `${style}${document.body.innerHTML}`
})
</script>

<template>
  <UiShadowRoot class="h-max px-4">
    <div
      :style="{
        display: 'contents'
      }"
      v-html="mailContent"
    />
  </UiShadowRoot>
</template>
