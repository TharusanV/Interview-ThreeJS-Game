import { useEffect } from 'react';
import { useCameraStore } from '../GlobalStateManager/useCameraStore';

const useMouseHandling = () => {
  const angleYRef = useCameraStore((state) => state.angleYRef); // yaw
  const angleXRef = useCameraStore((state) => state.angleXRef); // pitch

  const yawSensitivity = 0.002;
  const pitchSensitivity = 0.002;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const deltaX = e.movementX || 0;
      const deltaY = e.movementY || 0;

      angleYRef.current -= deltaX * yawSensitivity;
      angleXRef.current -= deltaY * pitchSensitivity;

      // Clamp pitch to prevent flipping camera upside down
      const pitchLimit = Math.PI / 2 - 0.01;
      angleXRef.current = Math.max(-pitchLimit, Math.min(pitchLimit, angleXRef.current));
    };

    const enablePointerLock = () => {
      if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', enablePointerLock);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', enablePointerLock);
    };
  }, []);
};

export default useMouseHandling;
