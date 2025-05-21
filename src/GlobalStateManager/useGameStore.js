import { create } from 'zustand'
import { subscribeWithSelector } from "zustand/middleware";

export const gameStates = { //Enum
  MENU: "MENU",
  INGAME: "INGAME",
  GAMEOVER: "GAMEOVER",
};

export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    //STATES
    canMove: true, 
    isPaused: false,
    gameState: gameStates.INGAME,
    level: 1,
    isCinematicPlaying: true,

    // Actions
    setLevel: (levelNum) => set({levelNum}),
    setCanMove: (canMove) => set({ canMove }),

    startGame: () => {
      set({ gameState: gameStates.INGAME});
    },

    setGameState: (state) => set({ gameState: state }),

    pauseGame: () => {
      set({ isPaused: true, canMove: false });
    },
    resumeGame: () => {
      set({ isPaused: false, canMove: true });
    },

    startCinematic: () => set({ isCinematicPlaying: true }),
    endCinematic: () => set({ isCinematicPlaying: false }),

  }))
);
