<script setup lang="ts">
const emit = defineEmits<{
  (e: "submit", { name, icon, query }: { name: string; icon: string; query: string }): Promise<void>;
}>();

const name = ref("");
const icon = ref("");
const query = ref("");

const handleSubmit = async () => {
  await emit('submit', { name: name.value, icon: icon.value, query: query.value });
  name.value = "";
  icon.value = "";
  query.value = "";
};

</script>

<template>
  <UiDialogContent>
    <UiDialogHeader>
      <UiDialogTitle>新しいカスタムトレイ</UiDialogTitle>
      <UiDialogDescription>
        カスタムトレイの名前と検索条件を入力してください
      </UiDialogDescription>
    </UiDialogHeader>
    <form id="create-custom-inbox-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div class="flex gap-1">
        <AppIconPicker v-model="icon" class="shrink-0"/>
        <UiInput v-model="name" type="text" placeholder="カスタムトレイの名前" />
      </div>
      <UiInput v-model="query" type="text" placeholder="カスタムトレイの検索条件" />
    </form>
    <UiDialogFooter>
      <UiDialogClose>
        <UiButton variant="secondary">
          キャンセル
        </UiButton>
      </UiDialogClose>
      <UiButton type="submit" :disabled="!name || !query" form="create-custom-inbox-form">
        作成
      </UiButton>
    </UiDialogFooter>
  </UiDialogContent>
</template>
