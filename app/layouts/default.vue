<template>
  <UiSidebarProvider class="w-full max-w-screen flex relative">
    <AppSidebar />
    <main class="w-full min-w-0">
      <div class="z-10 p-1 sticky inset-0 flex">
        <div class="absolute inset-5">
          <AppSidebarTrigger show-on="closed" />
        </div>
      </div>
      <slot />
    </main>
  </UiSidebarProvider>
</template>
