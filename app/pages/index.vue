<script setup lang="ts">
const mails = [
  { id: 1, subject: 'Meeting Reminder', time: '2 hours ago', from: 'Alice' },
  { id: 2, subject: 'Project Update', time: '3 hours ago', from: 'Bob' },
  { id: 3, subject: 'Newsletter Subscription', time: '1 day ago', from: 'Newsletter' },
  { id: 4, subject: 'Invoice Received', time: '2 days ago', from: 'Finance' }
]
</script>

<template>
  <div>
    <div class="m-auto h-80 grid place-items-center">
      <div>
        <h1 class="text-3xl text-center font-bold mb-4">
          Such a lovely morning.
        </h1>
        <p class="mb-4 text-lg text-center">
          This is a simple home page with a sidebar.
        </p>
      </div>
    </div>
    <div class="w-full">
      <h2 class="mx-6 text-2xl font-bold">
        Unread Mails
      </h2>
      <div class="overflow-x-auto">
        <ul class="flex gap-4 p-6 box-border min-w-full w-fit">
          <li
            v-for="mail in mails"
            :key="mail.id"
            class="contents"
          >
            <UiCard class="min-w-64 flex-1 h-48">
              <template #header>
                <span class="size-10 block bg-amber-700 rounded-full" />
              </template>
              <UiCardTitle>
                {{ mail.subject }}
              </UiCardTitle>
              <span class="text-muted-foreground"> from {{ mail.from }}</span>
              <time class="text-muted-foreground text-sm ml-2">{{ mail.time }}</time>
            </UiCard>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
