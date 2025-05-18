import { useEffect } from 'react';
import { useCameraStore } from '../GlobalStateManager/useCameraStore';

const useMouseHandling = () => {
  const angleYRef = useCameraStore(state => state.angleYRef);
  const yawSensitivity = 0.002;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const deltaX = e.movementX || 0;
      angleYRef.current -= deltaX * yawSensitivity;
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
