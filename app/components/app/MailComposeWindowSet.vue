<script setup lang="ts">
const draftsStore = useDraftsStore()
</script>

<template>
  <div class="flex gap-4 fixed bottom-0 right-0 pr-8 w-full justify-end items-end">
    <AppMailComposeWindow
      v-for="draftId in draftsStore.draftIds"
      :key="draftId"
      @close="draftsStore.deleteDraft(draftId)"
    />
  </div>
</template>
