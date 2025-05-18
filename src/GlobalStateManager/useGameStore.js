import { create } from 'zustand'

export const useGameStore = create((set) => ({
  canMove: true, 
  setCanMove: (canMove) => set({ canMove }),
}));
