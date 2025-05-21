import { useEffect, useRef } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useGameStore, gameStates } from '../GlobalStateManager/useGameStore';

const MouseLookController = () => {
  const gameState = useGameStore((state) => state.gameState);
  const isInGame = gameState === gameStates.INGAME;
  const controlsRef = useRef();
  const { gl } = useThree();

  useEffect(() => {
    if (isInGame && document.pointerLockElement !== gl.domElement) {
      // Delay required because controls may not be mounted yet
      const timeout = setTimeout(() => {
        gl.domElement.requestPointerLock?.();
      }, 100); // short delay lets React finish rendering

      return () => clearTimeout(timeout);
    }
  }, [isInGame, gl.domElement]);

  return <PointerLockControls ref={controlsRef} />;
};

export default MouseLookController;
