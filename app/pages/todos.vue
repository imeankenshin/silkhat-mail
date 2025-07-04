<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  middleware: 'auth'
})
const newTodo = ref('')
const newTodoInput = useTemplateRef('new-todo')

const queryCache = useQueryCache()
const { $trpc } = useNuxtApp()

const { data: todos } = useQuery({
  key: ['todos'],
  query: () => $trpc.todos.get.query() as Promise<Todo[]>
})

const { mutate: addTodo, isLoading: loading } = useMutation({
  mutation: (title: string) => {
    if (!title.trim()) throw new Error('Title is required')

    return $trpc.todos.add.mutate({ title })
  },

  async onSuccess(todo) {
    await queryCache.invalidateQueries({ key: ['todos'] })
    toast.success(`Todo "${todo.title}" created.`)
  },

  onSettled() {
    newTodo.value = ''
    // the first nextTick allows loading to become false and re enable the input
    // the second nextTick allows the input to be rendered again so it can be focused
    // a better solution would be to use a custom `v-focus` directive or a more elaborated focus management solution
    nextTick()
      .then(() => nextTick())
      .then(() => {
        newTodoInput.value?.inputRef.focus()
      })
  },

  onError(err) {
    if (isTRPCClientError(err) && err.data?.issues) {
      const title = err.data.issues.map(issue => issue.message).join('\n')
      if (title)
        toast.error(title)
    }
    else {
      console.error(err)
      toast.error('Unexpected Error')
    }
  }
})

const { mutate: toggleTodo } = useMutation({
  mutation: (todo: Todo) =>
    $trpc.todos.update.mutate({
      id: todo.id,
      values: { completed: Number(!todo.completed) }
    }),

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['todos'] })
  }
})

const { mutate: deleteTodo } = useMutation({
  mutation: (todo: Todo) =>
    $trpc.todos.delete.mutate({ id: todo.id }),

  async onSuccess(_result, todo) {
    await queryCache.invalidateQueries({ key: ['todos'] })
    toast.success(`Todo "${todo.title}" deleted.`)
  }
})
</script>

<template>
  <form
    class="flex flex-col gap-4 p-6"
    @submit.prevent="addTodo(newTodo)"
  >
    <div class="flex items-center gap-2">
      <UiInput
        ref="new-todo"
        v-model="newTodo"
        name="todo"
        :disabled="loading"
        class="flex-1"
        placeholder="Make a Nuxt demo"
        autocomplete="off"
        autofocus
        :ui="{ base: 'flex-1' }"
      />

      <UiButton
        type="submit"
        icon="i-lucide-plus"
        :loading="loading"
        :disabled="newTodo.trim().length === 0"
      />
    </div>

    <ul class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="todo of todos"
        :key="todo.id"
        class="flex items-center gap-4 py-2"
      >
        <span
          class="flex-1 font-medium"
          :class="[todo.completed ? 'line-through text-gray-500' : '']"
        >{{ todo.title }}</span>

        <UiSwitch
          :model-value="Boolean(todo.completed)"
          @update:model-value="toggleTodo(todo)"
        />

        <UiButton
          color="error"
          variant="ghost"
          size="icon"
          icon="i-lucide-x"
          @click="deleteTodo(todo)"
        />
      </li>
    </ul>
  </form>
</template>
