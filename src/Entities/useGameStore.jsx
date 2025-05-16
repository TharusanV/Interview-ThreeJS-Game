import { create } from 'zustand'

export const useGameStore = create((set) => ({
  cameraMode: 'default',
  setCameraMode: (mode) => set({ cameraMode: mode }),
  
  playerRef: null,
  setPlayerRef: (ref) => set({ playerRef: ref }),
}))
