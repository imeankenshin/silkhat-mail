<script setup lang="ts">
import type { IconifyJSON } from "@iconify/types"
import split from "just-split"

const selected = defineModel<string>()
const open = ref(false)
const search = ref("")

const { data: parsedIconifyJson } = await useAsyncData<{ icons: string[] }>("icons", async () => {
  const icons = (await import("@iconify-json/material-symbols/icons.json")).default as IconifyJSON
  return { icons: Object.keys(icons.icons).filter(icon => icon.endsWith("-rounded") && !icon.includes("-outline")).map(icon => `${icons.prefix}:${icon}`) }
}, { default: () => ({ icons: [] }) })

const displayedIcons = computed(() => split(parsedIconifyJson.value.icons.filter(icon => icon.includes(search.value)), 6))

const { list: iconsList, wrapperProps, containerProps, scrollTo } = useVirtualList(displayedIcons, {
  itemHeight: 40,
  overscan: 6,
})

const select = (value: string) => {
  selected.value = value
  open.value = false
}

watch(search, () => {
  scrollTo(0)
})
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton size="icon" variant="outline" v-bind="$attrs">
        <Icon v-if="selected" mode="svg" class="size-6" :name="selected" />
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0">
      <UiInput v-model="search" type="text" class="w-full" placeholder="検索" />
      <div v-bind="containerProps" class="p-4" style="height: 200px; width: 268px;">
        <div v-bind="wrapperProps">
          <div v-for="icons in iconsList" :key="icons.index" class="h-10 grid grid-cols-6 gap-1">
            <UiButton
              v-for="icon in icons.data"
              :key="icon"
              variant="ghost"
              size="icon"
              class="flex items-center justify-center"
              @click="select(icon)"
            >
              <Icon mode="svg" :name="icon" />
            </UiButton>
          </div>
        </div>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
