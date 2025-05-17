import React, {useEffect, useState} from 'react'

export const useKeyboardHandling = () => {
  const keys = {KeyW: "forward", KeyS: "backward", KeyA: "left", KeyD: "right", Shift: "sprint"}
  const moveFieldByKey = (key) => keys[key];
  const [movement, setMovement] = useState({forward: false, backward: false, left: false, right: false, sprint: false})
  

    const setMovementStatus = (code, status) => {
      setMovement((m) => ({...m, [code]: status}))
    }

    useEffect(() => {
      const handleKeyDown = (ev) => {
          setMovementStatus(moveFieldByKey(ev.code), true);
      }

      const handleKeyUp = (ev) => {
          setMovementStatus(moveFieldByKey(ev.code), false);
      }

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('keyup', handleKeyUp);
      }
    }, []);

    return movement;



}
