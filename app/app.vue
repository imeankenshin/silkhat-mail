<script setup lang="ts">
const { data: session } = await authClient.useSession(useFetch)
const loggedIn = computed(() => !!session.value)

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

const colorMode = useColorMode()

const themeColor = computed(() => colorMode.value === 'dark' ? 'oklch(0.205 0 0)' : 'oklch(0.985 0 0)')

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/icon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
  ],
  meta: [
    { name: 'theme-color', content: themeColor }
  ]
})

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Silk Hat Mail',
  description:
    'An open-source mail management app you’ll actually enjoy using.',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <AppMailComposeWindowSet />
    <UiSonner />
  </NuxtLayout>
</template>

<style lang="postcss">
body {
  @apply font-sans text-neutral-950 bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50;
}
</style>
