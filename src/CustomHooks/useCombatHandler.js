import { useEffect, useState } from 'react';

export const useCombatHandler = () => {
  const [clicks, setClicks] = useState({
    leftClick: false,
    rightClick: false,
    middleClick: false,
  });

  useEffect(() => {
    const handleMouseDown = (ev) => {
      if (ev.button === 0) {
        setClicks({ leftClick: true, rightClick: false, middleClick: false });
      } 
      else if (ev.button === 2) {
        setClicks({ leftClick: false, rightClick: true, middleClick: false });
      } 
      else if (ev.button === 1) {
        setClicks({ leftClick: false, rightClick: false, middleClick: true });
      }
    };

    const handleMouseUp = () => {
      setClicks({ leftClick: false, rightClick: false, middleClick: false });
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return clicks;
};
