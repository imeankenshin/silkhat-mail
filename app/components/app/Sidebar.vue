<script setup lang="ts">
const { data: session } = await authClient.useSession(useFetch)
const loggedIn = computed(() => !!session.value)
const signIn = () => {
  authClient.signIn.social({
    provider: 'google'
  })
}
</script>

<template>
  <UiSidebar>
    <UiSidebarHeader class="p-2">
      <NuxtLink to="/">
        Atidone
      </NuxtLink>
    </UiSidebarHeader>
    <UiSidebarContent>
      <UiSidebarGroup>
        <UiSidebarGroupContent>
          <UiSidebarMenu>
            <UiSidebarMenuItem>
              <UiSidebarMenuButton as-child>
                <NuxtLink to="/todos">
                  <Icon
                    mode="svg"
                    name="i-lucide-list"
                  />
                  Todos
                </NuxtLink>
              </uisidebarmenubutton>
            </UiSidebarMenuItem>
            <UiSidebarMenuItem>
              <UiSidebarMenuButton as-child>
                <NuxtLink to="/optimistic-todos">
                  <Icon
                    mode="svg"
                    name="i-lucide-sparkles"
                  />
                  Optimistic Todos
                </NuxtLink>
              </UiSidebarMenuButton>
            </uisidebarmenuitem>
          </UiSidebarMenu>
        </UiSidebarGroupContent>
      </UiSidebarGroup>
      <UiButton
        v-if="!loggedIn"
        icon="i-simple-icons-google"
        color="neutral"
        external
        @click="signIn()"
      >
        Login with Google
      </UiButton>
    </UiSidebarContent>
    <UiSidebarFooter>
      <UiSidebarMenu>
        <UiSidebarMenuItem>
          <UiDropdownMenu v-if="session?.user">
            <UiDropdownMenuTrigger as-child>
              <UiButton
                color="neutral"
                variant="ghost"
                class="w-full justify-start"
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
                <UiDropdownMenuItem>
                  <button
                    class="dropdown-item"
                    @click="authClient.signOut()"
                  >
                    Sign Out
                  </button>
                </UiDropdownMenuItem>
              </UiDropdownMenuGroup>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </UiSidebarMenuItem>
      </UiSidebarMenu>
    </UiSidebarFooter>
  </UiSidebar>
</template>
