<script setup lang="ts">
const { $trpc } = useNuxtApp()
const selectedMail = useSelectedMailStore()

const { data: mail } = useQuery({
  key: () => ['mail', selectedMail.mail?.id || 'null'],
  query: async () => {
    if (!selectedMail.mail?.id) return null
    return await $trpc.mails.get.query({ id: selectedMail.mail?.id })
  }
})
</script>

<template>
  <UiSheet
    :open="!!selectedMail.mail"
    @update:open="selectedMail.unselect()"
  >
    <UiSheetContent class="sm:max-w-2xl overflow-y-auto outline-none">
      <div class="h-full">
        <UiSheetHeader class="pt-12">
          <template v-if="mail">
            <h2 class="text-xl font-bold text-foreground">
              {{ mail.subject }}
            </h2>
            <div>
              <p class="text-muted-foreground">
                To: {{ mail.to }}
              </p>
              <p class="text-muted-foreground">
                From: {{ mail.from }}
              </p>
            </div>
          </template>
          <UiSkeleton
            v-else
            class="h-7"
          />
        </UiSheetHeader>
        <AppMailRenderer
          v-if="mail"
          :mail
        />
        <UiSkeleton v-else />
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
