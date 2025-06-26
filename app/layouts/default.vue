<template>
  <UiSidebarProvider class="w-full max-w-screen flex relative">
    <AppSidebar />
    <main class="flex-col w-full min-w-0">
      <div class="z-10 p-3">
        <UiSidebarTrigger />
      </div>
      <slot />
    </main>
  </UiSidebarProvider>
</template>
