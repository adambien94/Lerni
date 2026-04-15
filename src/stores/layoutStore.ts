import { create } from "zustand";

type LayoutState = {
  isCreateNotebookModalOpen: boolean;
  openCreateNotebookModal: () => void;
  closeCreateNotebookModal: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isCreateNotebookModalOpen: false,
  openCreateNotebookModal: () => set({ isCreateNotebookModalOpen: true }),
  closeCreateNotebookModal: () => set({ isCreateNotebookModalOpen: false }),
}));
