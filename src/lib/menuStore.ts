import { create } from 'zustand';

interface MenuState {
  isOpen: boolean;
  actions: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  actions: {
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen }))
  }
}));