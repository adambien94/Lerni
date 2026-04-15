import { create } from 'zustand'

type Source = {
  id: string
  url: string
  checked: boolean
}

type AppState = {
  sourceUrl: string
  sources: Source[]
  setSourceUrl: (value: string) => void
  addSource: () => void
  clearSources: () => void
  toggleSource: (id: string) => void
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
      sources: [{ id: crypto.randomUUID(), url, checked: true }, ...state.sources],
    }))
  },
  clearSources: () => set({ sources: [] }),
  toggleSource: (id) =>
    set((state) => ({
      sources: state.sources.map((source) =>
        source.id === id ? { ...source, checked: !source.checked } : source,
      ),
    })),
}))
