type DraftId = symbol

export const useDraftsStore = defineStore('drafts', () => {
  const draftIds = ref<DraftId[]>([])
  return {
    draftIds: readonly(draftIds),
    createDraft: () => {
      const id: DraftId = Symbol('This is a draft id')
      draftIds.value.unshift(id)
      return id
    },
    deleteDraft: (id: DraftId) =>
      (draftIds.value = draftIds.value.filter(i => i !== id))
  }
})
