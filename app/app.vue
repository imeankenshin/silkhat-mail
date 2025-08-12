<script setup lang="ts">
const { data: session } = await authClient.useSession(useFetch)
const loggedIn = computed(() => !!session.value)

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.svg' }]
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
    <UiSonner />
  </NuxtLayout>
</template>

<style lang="postcss">
body {
  @apply font-sans text-neutral-950 bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50;
}
</style>
