import { create } from 'zustand'
import { subscribeWithSelector } from "zustand/middleware";

export const usePlayerStore = create(
  subscribeWithSelector((set, get) => ({
    //STATES
    playerRef: null,
    health: 100,
    maxHealth: 100,
    spawnPoint: [0,0,0],
    equippedItem: null, 
    playerAnimation: null,

    //Actions
    setPlayerRef: (player) => set({playerRef: player}),
    setPlayerAnimation: (anim) => set({playerAnimation: anim}),
    equipAnItem: (item) => set({ equippedItem: item }),

  }))
);