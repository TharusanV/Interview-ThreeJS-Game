import { create } from 'zustand'
import { subscribeWithSelector } from "zustand/middleware";

export const usePlayerStore = create(
  subscribeWithSelector((set, get) => ({
    //STATES
    health: 100,
    maxHealth: 100,
    spawnPoint: [0,0,0],
    equippedItem: null, 

    //Actions
    equipAnItem: (item) => set({ equippedItem: item }),

  }))
);