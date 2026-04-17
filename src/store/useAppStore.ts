import { create } from "zustand";

type Source = {
  id: string;
  url: string;
  checked: boolean;
  customTitle?: string;
};

type AppState = {
  sourceUrl: string;
  sources: Source[];
  setSourceUrl: (value: string) => void;
  addSource: () => void;
  clearSources: () => void;
  toggleSource: (id: string) => void;
  removeSource: (id: string) => void;
  renameSource: (id: string, title: string) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  sourceUrl: "",
  sources: [
    {
      id: crypto.randomUUID(),
      url: "https://blog.it-leaders.pl/react-11-zaawansowanych-pytan-rekrutacyjnych-ktore-powinienes-absolutnie-znac/",
      checked: true,
    },
    {
      id: crypto.randomUUID(),
      url: "https://mockit.pl/blog/rozmowa-kwalifikacyjna-react-pytania-rekrutacyjne",
      checked: true,
    },
    {
      id: crypto.randomUUID(),
      url: "https://www.guru99.com/pl/react-js-interview-questions.html",
      checked: true,
    },
    {
      id: crypto.randomUUID(),
      url: "https://www.reddit.com/r/react/comments/1jh11th/frontend_interview_coding_questions_that_keep/?tl=pl",
      checked: true,
    },
  ],
  setSourceUrl: (value) => set({ sourceUrl: value }),
  addSource: () => {
    const url = get().sourceUrl.trim();
    if (!url) return;

    set((state) => ({
      sourceUrl: "",
      sources: [
        { id: crypto.randomUUID(), url, checked: true },
        ...state.sources,
      ],
    }));
  },
  clearSources: () => set({ sources: [] }),
  toggleSource: (id) =>
    set((state) => ({
      sources: state.sources.map((source) =>
        source.id === id ? { ...source, checked: !source.checked } : source,
      ),
    })),
  removeSource: (id) =>
    set((state) => ({
      sources: state.sources.filter((source) => source.id !== id),
    })),
  renameSource: (id, title) =>
    set((state) => ({
      sources: state.sources.map((source) =>
        source.id === id ? { ...source, customTitle: title.trim() } : source,
      ),
    })),
}));
