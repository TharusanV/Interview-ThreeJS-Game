import { create } from 'zustand'
import { subscribeWithSelector } from "zustand/middleware";

export const usePointerStore = create(
  subscribeWithSelector((set, get) => ({
    cursorType: "selector",  // "selector", "grab", "crosshair", null
    isFiring: false,

    setCursorType: (type) => set({ cursorType: type }),
    setIsFiring: (isFiring) => set({ isFiring }),
  }))
);