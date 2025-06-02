<script setup lang="ts">
</script>

<template>
  <UiSidebarProvider class="flex">
    <AppSidebar />
    <div class="flex-1 relative">
      <div class="z-10 p-3 top-0">
        <UiSidebarTrigger />
      </div>
      <slot />
    </div>
  </UiSidebarProvider>
</template>
