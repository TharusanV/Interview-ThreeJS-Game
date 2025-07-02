import React, {useEffect, useState} from 'react'
import { usePlayerStore } from "../GlobalStateManager/usePlayerStore";

export const useMovementHandler = () => {
  const moveFieldByKey = (key) => keys[key];

  const keys = {KeyW: "forward", KeyS: "backward", KeyA: "left", KeyD: "right", Space: "spacebarHold", ControlLeft: "ctrlHold",}
  const [movement, setMovement] = useState({forward: false, backward: false, left: false, right: false, spacebarHold: false, ctrlHold: false})
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  const setMovementStatus = (codeKey, boolean) => {
    if (!codeKey) return;

    if (codeKey === 'spacebarHold') {
      if (boolean && !movement.spacebarHold){ 
        setSpacebarPressed(true);
      }
    }

    if (codeKey === "ctrlHold") {
      if (boolean && !movement.ctrlHold){
        setCtrlPressed(true);
      }
    }

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
  }, [movement]);

  // Reset press flags after each render frame
  useEffect(() => {
    if (spacebarPressed) {
      const timeout = setTimeout(() => setSpacebarPressed(false), 0);
      return () => clearTimeout(timeout);
    }
    
    if (ctrlPressed) {
      const timeout = setTimeout(() => setCtrlPressed(false), 0);
      return () => clearTimeout(timeout);
    }
  }, [spacebarPressed, ctrlPressed]);

  return {
    ...movement,
    spacebarPressed,
    ctrlPressed,
  };
}
