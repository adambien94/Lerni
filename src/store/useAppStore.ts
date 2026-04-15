import { create } from 'zustand'

type Source = {
  id: string
  url: string
}

type AppState = {
  sourceUrl: string
  sources: Source[]
  setSourceUrl: (value: string) => void
  addSource: () => void
  clearSources: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  sourceUrl: '',
  sources: [],
  setSourceUrl: (value) => set({ sourceUrl: value }),
  addSource: () => {
    const url = get().sourceUrl.trim()
    if (!url) return

    set((state) => ({
      sourceUrl: '',
      sources: [{ id: crypto.randomUUID(), url }, ...state.sources],
    }))
  },
  clearSources: () => set({ sources: [] }),
}))
