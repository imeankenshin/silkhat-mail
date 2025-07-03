<template>
  <UiSidebarProvider class="w-full max-w-screen flex relative">
    <AppSidebar />
    <main class="flex-col w-full min-w-0">
      <div class="z-10 p-1 sticky inset-0 flex">
        <div class="p-2 bg-background/30 backdrop-blur rounded-lg">
          <UiSidebarTrigger />
        </div>
      </div>
      <slot />
    </main>
  </UiSidebarProvider>
</template>
