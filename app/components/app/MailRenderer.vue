<script setup lang="ts">
const props = defineProps<{
  mail: FullMail
}>()

const escapeHtml = (value: string) =>
  value
    .replaceAll(/&/g, '&amp;')
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .replaceAll(/'/g, '&#39;')

const mailContent = computed(() => {
  if (!props.mail.isHTML) {
    const content = props.mail?.content ?? ''
    const escaped = escapeHtml(content)
    return escaped.replaceAll('\n', '<br>')
  }
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
  document.querySelectorAll('a').forEach((a) => {
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
  })
  return `${style}${document.body.innerHTML}`
})
</script>

<template>
  <div>
    <UiShadowRoot
      v-if="mail.isHTML"
      class="h-max px-4"
    >
      <div
        :style="{
          display: 'contents'
        }"
        v-html="mailContent"
      />
    </UiShadowRoot>
    <div
      v-else
      class="h-max px-4"
      v-html="mailContent"
    />
  </div>
</template>
