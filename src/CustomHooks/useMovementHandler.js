import React, {useEffect, useState} from 'react'
import { usePlayerStore } from "../GlobalStateManager/usePlayerStore";

export const useMovementHandler = () => {
  const moveFieldByKey = (key) => keys[key];

  const keys = {KeyW: "forward", KeyS: "backward", KeyA: "left", KeyD: "right", Space: "spacebar" }
  const [movement, setMovement] = useState({forward: false, backward: false, left: false, right: false, spacebar: false})

  const setMovementStatus = (codeKey, boolean) => {
    if (!codeKey) return;

    setMovement((m) => ({ ...m, [codeKey]: boolean }));
  };

  useEffect(() => {
    const handleKeyDown = (ev) => {
      const key = moveFieldByKey(ev.code);
      setMovementStatus(key, true);
    };

    const handleKeyUp = (ev) => {
      const key = moveFieldByKey(ev.code);
      setMovementStatus(key, false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return {
    ...movement,
  };
}
