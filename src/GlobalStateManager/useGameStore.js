import { create } from 'zustand'
import { subscribeWithSelector } from "zustand/middleware";
import { usePointerStore } from '../GlobalStateManager/usePointerStore';

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
    level: 1,
    isCinematicPlaying: false,

    // Actions
    startGame: () => {
      set({ gameState: gameStates.INGAME, isCinematicPlaying: true});
      usePointerStore.getState().setCursorType(null)
    },

    endCinematic: () => {
      set({ isCinematicPlaying: false, });
    },

    pauseGame: () => {
      set({ isPaused: true, canMove: false });
    },

    resumeGame: () => {
      set({ isPaused: false, canMove: true });
    },

  }))
);
