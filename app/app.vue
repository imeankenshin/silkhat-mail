<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'

const { data: session } = await authClient.useSession(useFetch)
const loggedIn = computed(() => !!session.value)
const colorMode = useColorMode()

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: () =>
    (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')
})

const signIn = () => {
  authClient.signIn.social({
    provider: 'google'
  })
}

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.png' }]
})

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Atidone',
  description:
    'A Nuxt demo hosted with edge-side rendering, authentication and queyring a Cloudflare D1 database',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
})

const items = [
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => authClient.signOut()
    }
  ]
] satisfies DropdownMenuItem[][]
</script>

<template>
  <UApp>
    <UContainer class="min-h-screen flex flex-col my-4">
      <div class="mb-2 text-right">
        <UButton
          square
          variant="ghost"
          color="neutral"
          :icon="
            $colorMode.preference === 'dark' || $colorMode.preference === 'system'
              ? 'i-lucide-moon'
              : 'i-lucide-sun'
          "
          @click="isDarkMode = !isDarkMode"
        />
      </div>

      <UCard variant="subtle">
        <template #header>
          <h3 class="text-lg font-semibold leading-6">
            <NuxtLink to="/">
              Atidone
            </NuxtLink>
          </h3>
          <UButton
            v-if="!loggedIn"
            icon="i-simple-icons-google"
            label="Login with Google"
            color="neutral"
            size="xs"
            external
            @click="signIn()"
          />
          <div
            v-else
            class="flex flex-wrap -mx-2 sm:mx-0"
          >
            <UButton
              to="/todos"
              icon="i-lucide-list"
              label="Todos"
              :color="$route.path === '/todos' ? 'primary' : 'neutral'"
              variant="ghost"
            />
            <UButton
              to="/optimistic-todos"
              icon="i-lucide-sparkles"
              label="Optimistic Todos"
              :color="$route.path === '/optimistic-todos' ? 'primary' : 'neutral'"
              variant="ghost"
            />
            <UDropdownMenu
              v-if="session?.user"
              :items="items"
            >
              <UButton
                color="neutral"
                variant="ghost"
                trailing-icon="i-lucide-chevron-down"
              >
                <UAvatar
                  :src="session.user.image || undefined"
                  :alt="session.user.name"
                  size="3xs"
                />
                {{ session.user.name }}
              </UButton>
            </UDropdownMenu>
          </div>
        </template>
        <NuxtPage />
      </UCard>

      <footer class="text-center mt-2">
        <NuxtLink
          href="https://github.com/atinux/atidone"
          target="_blank"
          class="text-sm text-neutral-500 hover:text-neutral-700"
        >
          GitHub
        </NuxtLink>
        ·
        <NuxtLink
          href="https://twitter.com/atinux"
          target="_blank"
          class="text-sm text-neutral-500 hover:text-neutral-700"
        >
          Twitter
        </NuxtLink>
      </footer>
    </UContainer>
  </UApp>
</template>

<style lang="postcss">
body {
  @apply font-sans text-neutral-950 bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50;
}
</style>
