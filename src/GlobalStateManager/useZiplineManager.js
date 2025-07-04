import { create } from 'zustand'
import { subscribeWithSelector } from "zustand/middleware";

export const useZiplineManager = create(
  subscribeWithSelector((set, get) => ({
    ziplinePillars: [
      {
        name: "1-zipline-pillar-start",
        pos: [20, 0, 0],
        dimensions: [0.1, 4, 0.1],
        start: [20, 4, 0],
        end: [-20, 20, 0],
      },
      {
        name: "1-zipline-pillar-end",
        pos: [-20, 0, 0],
        dimensions: [0.1, 20, 0.1],
        start: [-20, 20, 0],
        end: [20, 4, 0],
      },
    ],
  }))
);