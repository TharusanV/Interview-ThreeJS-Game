import { create } from 'zustand';

export const useCameraStore = create((set) => ({
  cameraMode: 'movement',
  setCameraMode: (mode) => set({ cameraMode: mode }),

}));
