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
    canMove: true, 
    isPaused: false,
    gameState: gameStates.MENU,
    level: 0,

    isCinematicPlaying: false,
    hasCinematicFinished: false,

    isCameraLocked: false,

    // Actions
    startGame: () => {
      set({ gameState: gameStates.INGAME, isCinematicPlaying: true, isCameraLocked: true});
      usePointerStore.getState().setCursorType(null)
    },

    endCinematic: () => {
      set({ isCinematicPlaying: false, hasCinematicFinished: true, canMove: true});
    },

    pauseGame: () => {
      set({ isPaused: true, canMove: false });
    },

    resumeGame: () => {
      set({ isPaused: false, canMove: true });
    },

    setCameraLocked: (state) => { set({isCameraLocked: state})},
    setCanMove: (state) => {set({canMove: state})},

  }))
);
