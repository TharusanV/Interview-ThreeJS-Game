import create from 'zustand';

export const useCameraStore = create((set) => ({
  cameraMode: 'movement', 
  setCameraMode: (mode) => set({ mode }),
  
  pivotRotationY: 0, // controlled via mouse input
  setPivotRotationY: (val) => set({ pivotRotationY: val }),
}));
