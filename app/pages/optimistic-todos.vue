<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  middleware: 'auth'
})
const newTodo = ref('')

const { data: session } = await authClient.useSession(useFetch)
const queryCache = useQueryCache()
const { $trpc } = useNuxtApp()

const { data: todos } = useQuery({
  key: ['todos'],
  query: () => $trpc.todos.get.query() as Promise<Todo[]>
})

const { mutate: addTodo } = useMutation({
  mutation: (title: string) => {
    if (!title.trim()) throw new Error('Title is required')

    return $trpc.todos.add.mutate({ title })
  },

  onMutate(title) {
    // let the user enter new todos right away!
    newTodo.value = ''
    const oldTodos = queryCache.getQueryData<Todo[]>(['todos']) || []
    const newTodoItem = {
      title,
      completed: 0,
      // a negative id to differentiate them from the server ones
      id: -Date.now(),
      createdAt: new Date(),
      userId: session.value!.user.id
    } satisfies Todo
    // we use newTodos to check for the cache consistency
    // a better way would be to save the entry time
    // const when = queryCache.getEntries({ key: ['todos'], exact: true }).at(0)?.when
    const newTodos = [
      ...oldTodos,
      newTodoItem
    ]
    queryCache.setQueryData(['todos'], newTodos)

    queryCache.cancelQueries({ key: ['todos'], exact: true })

    return { oldTodos, newTodos, newTodoItem }
  },

  onSuccess(todo, _, { newTodoItem }) {
    // update the todo with the information from the server
    // since we are invalidating queries, this allows us to progressively
    // update the todo list even if the user is adding a lot very quickly
    const todoList = queryCache.getQueryData<Todo[]>(['todos']) || []
    const todoIndex = todoList.findIndex(t => t.id === newTodoItem.id)
    if (todoIndex >= 0) {
      queryCache.setQueryData(['todos'], todoList.toSpliced(todoIndex, 1, todo))
    }
  },

  onSettled() {
    // always refetch the todos after a mutation
    queryCache.invalidateQueries({ key: ['todos'] })
  },

  onError(err, _title, { oldTodos, newTodos }) {
    // oldTodos can be undefined if onMutate errors
    // we also want to check if the oldTodos are still in the cache
    // because the cache could have been updated by another query
    if (newTodos != null && newTodos === queryCache.getQueryData(['todos'])) {
      queryCache.setQueryData(['todos'], oldTodos)
    }
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

  onMutate(todo) {
    const oldTodos = queryCache.getQueryData<Todo[]>(['todos']) || []
    const todoIndex = oldTodos.findIndex(t => t.id === todo.id)
    let newTodos = oldTodos
    if (todoIndex >= 0) {
      newTodos = oldTodos.toSpliced(todoIndex, 1, {
        ...todo,
        completed: Number(!todo.completed)
      })
      queryCache.setQueryData(['todos'], newTodos)
    }

    queryCache.cancelQueries({ key: ['todos'], exact: true })

    return { oldTodos, newTodos }
  },

  onSettled() {
    // always refetch the todos after a mutation
    queryCache.invalidateQueries({ key: ['todos'], exact: true })
  },

  onError(err, todo, { oldTodos, newTodos }) {
    // oldTodos can be undefined if onMutate errors
    if (newTodos != null && newTodos === queryCache.getQueryData(['todos'])) {
      queryCache.setQueryData(['todos'], oldTodos)
    }

    console.error(err)
    toast.error('Unexpected Error')
  }
})

const { mutate: deleteTodo } = useMutation({
  mutation: (todo: Todo) => $trpc.todos.delete.mutate({ id: todo.id }),

  onMutate(todo) {
    const oldTodos = queryCache.getQueryData<Todo[]>(['todos']) || []
    const todoIndex = oldTodos.findIndex(t => t.id === todo.id)
    let newTodos = oldTodos
    if (todoIndex >= 0) {
      newTodos = oldTodos.toSpliced(todoIndex, 1)
      queryCache.setQueryData(['todos'], newTodos)
    }

    queryCache.cancelQueries({ key: ['todos'], exact: true })

    return { oldTodos, newTodos }
  },

  onSettled() {
    // always refetch the todos after a mutation
    queryCache.invalidateQueries({ key: ['todos'], exact: true })
  },

  onError(err, todo, { oldTodos, newTodos }) {
    // oldTodos can be undefined if onMutate errors
    if (newTodos != null && newTodos === queryCache.getQueryData(['todos'])) {
      queryCache.setQueryData(['todos'], oldTodos)
    }

    console.error(err)
    toast.error('Unexpected Error')
  }
})
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="addTodo(newTodo)"
  >
    <div class="flex items-center gap-2">
      <UiInput
        v-model="newTodo"
        name="todo"
        class="flex-1"
        placeholder="Make a Nuxt demo"
        autocomplete="off"
        autofocus
      />

      <UiButton
        type="submit"
        icon="i-lucide-plus"
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
          :class="{
            'text-gray-500': todo.completed || todo.id < 0,
            'line-through': todo.completed
          }"
        >{{ todo.title }}</span>

        <UiSwitch
          :model-value="Boolean(todo.completed)"
          :disabled="todo.id < 0"
          @update:model-value="toggleTodo(todo)"
        />

        <UiButton
          color="error"
          variant="ghost"
          size="icon"
          icon="i-lucide-x"
          :disabled="todo.id < 0"
          @click="deleteTodo(todo)"
        />
      </li>
    </ul>
  </form>
</template>
