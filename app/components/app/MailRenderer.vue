<script setup lang="ts">
import DOMPurify from 'dompurify'

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

const escapeHtmlAttribute = (value: string) =>
  value.replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const LINK_PLACEHOLDER_PREFIX = '__MAIL_RENDERER_LINK__'

const rewriteRootSelectors = (css: string) =>
  css.replace(
    /(^|[\s,{>+~])(html|body)(?=(?:[\s.{:#,[>+~]|$))/g,
    (_, prefix) => `${prefix}:host`
  )

const buildPlainTextHtml = (raw: string) => {
  let counter = 0
  const replacements = new Map<string, string>()
  const patterns: Array<[RegExp, (match: string) => string]> = [
    [
      /(https?:\/\/[^\s]+)/g,
      match =>
        `<a href="${escapeHtmlAttribute(encodeURI(match))}" target="_blank" rel="noopener noreferrer">${escapeHtml(match)}</a>`
    ],
    [
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      match => `<a href="mailto:${escapeHtmlAttribute(encodeURI(match))}">${escapeHtml(match)}</a>`
    ],
    [
      /\b([0-9]{3}-[0-9]{3}-[0-9]{4})\b/g,
      match => `<a href="tel:${match.replace(/\D/g, '')}">${escapeHtml(match)}</a>`
    ]
  ]

  const withPlaceholders = patterns.reduce((acc, [regex, build]) => acc.replace(regex, (value) => {
    const placeholder = `${LINK_PLACEHOLDER_PREFIX}${counter++}__`
    replacements.set(placeholder, build(value))
    return placeholder
  }), raw)

  let escaped = escapeHtml(withPlaceholders).replace(/\r?\n/g, '<br>')
  replacements.forEach((html, placeholder) => {
    escaped = escaped.replaceAll(placeholder, html)
  })
  return escaped
}

const mailContent = computed(() => {
  if (!props.mail.isHTML)
    return buildPlainTextHtml(props.mail?.content ?? '')
  const sanitized = DOMPurify.sanitize(props.mail.content)
  const document = new DOMParser().parseFromString(sanitized, 'text/html')

  const style = Array
    .from(document.querySelectorAll('style'))
    .map(s => `<style>${rewriteRootSelectors(s.textContent ?? '')}</style>`)
    .join('')
  // TODO: Implement dark reader.
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
