<script setup lang="ts">
const { data: session } = await authClient.useSession(useFetch)
const { createDraft } = useDraftsStore()
const loggedIn = computed(() => !!session.value)
const logIn = () => {
  authClient.signIn.social({
    provider: 'google'
  })
}

const commonSidebarGroup = [
  {
    name: 'Inbox',
    icon: 'material-symbols:inbox-rounded',
    to: '/mails'
  },
  {
    name: 'Starred',
    icon: 'material-symbols:star-rounded',
    to: '/mails?is=STARRED'
  },
  {
    name: 'Sent',
    icon: 'material-symbols:send-rounded',
    to: '/mails?is=SENT'
  },
  {
    name: 'Drafts',
    icon: 'material-symbols:drafts-rounded',
    to: '/mails?is=DRAFT'
  },
  {
    name: 'Promotions',
    icon: 'material-symbols:sell',
    to: '/mails?is=PROMOTIONS'
  }
]
</script>

<template>
  <UiSidebar>
    <UiSidebarHeader class="py-4 flex flex-row justify-between">
      <UiButton
        size="icon"
        variant="ghost"
        icon="material-symbols:edit-rounded"
        @click="createDraft()"
      />
      <AppSidebarTrigger show-on="open" />
    </UiSidebarHeader>
    <UiSidebarContent>
      <UiSidebarGroup>
        <UiSidebarGroupContent>
          <UiSidebarMenu>
            <UiSidebarMenuItem
              v-for="item in commonSidebarGroup"
              :key="item.to"
            >
              <UiSidebarMenuButton as-child>
                <NuxtLink :to="item.to">
                  <Icon
                    mode="svg"
                    :name="item.icon"
                  />
                  {{ item.name }}
                </NuxtLink>
              </UiSidebarMenuButton>
            </UiSidebarMenuItem>
          </UiSidebarMenu>
        </UiSidebarGroupContent>
      </UiSidebarGroup>
      <UiButton
        v-if="!loggedIn"
        icon="i-simple-icons-google"
        color="neutral"
        external
        @click="logIn()"
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
