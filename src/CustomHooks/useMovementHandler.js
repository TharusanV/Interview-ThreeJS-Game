import React, {useEffect, useState} from 'react'
import { usePlayerStore } from "../GlobalStateManager/usePlayerStore";

export const useMovementHandler = () => {
  const keys = {KeyW: "forward", KeyS: "backward", KeyA: "left", KeyD: "right", Space: "spacebarHold"}
  
  const moveFieldByKey = (key) => keys[key];
  const [movement, setMovement] = useState({forward: false, backward: false, left: false, right: false, spacebarHold: false})
  

  const [jumpReleased, setJumpReleased] = useState(true); 

  const setMovementStatus = (codeKey, boolean) => {
    if (codeKey === 'spacebarHold') {
      if (!boolean) setJumpReleased(true); // key released
    }
    setMovement((m) => ({ ...m, [codeKey]: boolean }));
  };

  useEffect(() => {
    const handleKeyDown = (ev) => {
      const key = moveFieldByKey(ev.code);
      if (key) setMovementStatus(key, true);
    };

    const handleKeyUp = (ev) => {
      const key = moveFieldByKey(ev.code);
      if (key) setMovementStatus(key, false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { ...movement, jumpReleased, setJumpReleased };
}
