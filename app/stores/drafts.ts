type DraftId = symbol

export const useDraftsStore = defineStore('drafts', () => {
  const draftIds = ref<DraftId[]>([])
  return {
    draftIds: readonly(draftIds),
    createDraft: () => draftIds.value.unshift(Symbol('This is a draft id')),
    deleteDraft: (id: DraftId) =>
      (draftIds.value = draftIds.value.filter(i => i !== id))
  }
})
