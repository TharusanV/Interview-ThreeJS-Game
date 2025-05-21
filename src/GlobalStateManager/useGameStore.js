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
    canMove: false, 
    isPaused: false,
    gameState: gameStates.MENU,

    // Actions
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
    }

  }))
);
