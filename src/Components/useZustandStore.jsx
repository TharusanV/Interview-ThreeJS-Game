import { create } from 'zustand';

export const useZustandStore = create((set) => ({
  playerRef: null,
  setPlayerRef: (ref) => set({ playerRef: ref }),

  cameraTargetRef: null,
  setCameraTargetRef: (ref) => set({ cameraTargetRef: ref }),

  cameraPivotRef: null,
  setCameraPivotRef: (ref) => set({ cameraPivotRef: ref }),

  cameraPositionRef: null,
  setCameraPositionRef: (ref) => set({ cameraPositionRef: ref }),

  yawRef: 0,
  setYawRef: (yaw) => set({ yawRef: yaw }),
}));
