import { PointerLockControls } from '@react-three/drei';
import { useGameStore, gameStates } from '../GlobalStateManager/useGameStore';


const MouseHandler = () => {
  const gameState = useGameStore((s) => s.gameState);
  const isCinematicPlaying = useGameStore((s) => s.isCinematicPlaying);

  const shouldEnablePointerLock = gameState === gameStates.INGAME && !isCinematicPlaying;

  return <PointerLockControls enabled={shouldEnablePointerLock} />;
};

export default MouseHandler;
