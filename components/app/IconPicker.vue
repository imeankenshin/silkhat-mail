<script setup lang="ts">
import type { IconifyJSON } from "@iconify/types"
import split from "just-split"

const cells = useTemplateRefsList<HTMLElement>()

const { data: parsedIconifyJson } = await useAsyncData<{ icons: string[] }>("icons", async () => {
  console.log("loading icons...")
  const icons = (await import("@iconify-json/material-symbols/icons.json")).default as IconifyJSON
  return { icons: Object.keys(icons.icons).filter(icon => icon.endsWith("-rounded") && !icon.includes("-outline")).map(icon => `${icons.prefix}:${icon}`) }
}, { default: () => ({ icons: [] }) })

const { list: iconsList, wrapperProps, containerProps } = useVirtualList(split(parsedIconifyJson.value.icons, 6), {
  itemHeight: 40,
  overscan: 6,
})

const selected = defineModel<string>()

useGridNavigation(cells, { cellPerLine: 6 })
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger as-child>
      <UiButton size="icon" variant="outline" v-bind="$attrs">
        <Icon v-if="selected" mode="svg" class="size-6" :name="selected" />
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0">
      <div v-bind="containerProps" class="p-4" style="height: 200px">
        <div v-bind="wrapperProps">
          <div v-for="icons in iconsList" :key="icons.index" class="h-10 grid grid-cols-6 gap-1">
            <UiButton
              v-for="icon in icons.data"
              :key="icon"
              :ref="cells.set"
              variant="ghost"
              size="icon"
              class="flex items-center justify-center"
              @click="selected = icon"
            >
              <Icon mode="svg" :name="icon" />
            </UiButton>
          </div>
        </div>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
