import { create } from 'zustand'

export const usePlayerStore = create((set) => ({
  playerRef: null,
  setPlayerRef: (ref) => set({ playerRef: ref }),
}))
