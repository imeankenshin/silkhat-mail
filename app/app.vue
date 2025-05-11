<script setup lang="ts">
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
</script>

<template>
  <div class="max-w-xl mx-auto min-h-screen flex flex-col my-4">
    <div class="mb-2 text-right">
      <UiButton
        variant="ghost"
        size="icon"
        :icon="
          $colorMode.preference === 'dark' || $colorMode.preference === 'system'
            ? 'i-lucide-moon'
            : 'i-lucide-sun'
        "
        @click="isDarkMode = !isDarkMode"
      />
    </div>

    <UiCard>
      <template #header>
        <NuxtLink to="/">
          Atidone
        </NuxtLink>
        <UiButton
          v-if="!loggedIn"
          icon="i-simple-icons-google"
          color="neutral"
          external
          @click="signIn()"
        >
          Login with Google
        </UiButton>
        <div
          v-else
          class="flex flex-wrap -mx-2 sm:mx-0"
        >
          <UiButton
            to="/todos"
            icon="i-lucide-list"
            :color="$route.path === '/todos' ? 'primary' : 'neutral'"
            variant="ghost"
          >
            Todos
          </UiButton>
          <UiButton
            to="/optimistic-todos"
            icon="i-lucide-sparkles"
            :color="$route.path === '/optimistic-todos' ? 'primary' : 'neutral'"
            variant="ghost"
          >
            Optimistic Todos
          </UiButton>
          <UiDropdownMenu
            v-if="session?.user"
          >
            <UiDropdownMenuTrigger as-child>
              <UiButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-chevron-down"
              >
                <UiAvatar
                  size="sm"
                  :src="session.user.image"
                  :alt="session.user.name"
                />
                {{ session.user.name }}
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent>
              <UiDropdownMenuGroup>
                <UiDropdownMenuItem @select="authClient.signOut()">
                  <Icon name="i-lucide-log-out" />
                  Logout
                </UiDropdownMenuItem>
              </UiDropdownMenuGroup>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </div>
      </template>
      <NuxtPage />
    </UiCard>

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
  </div>
  <UiSonner />
</template>

<style lang="postcss">
body {
  @apply font-sans text-neutral-950 bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50;
}
</style>
