import React, { useEffect } from 'react';

const FightKeyBinds = ({setAnimationState}) => {

    useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case '1':
          setAnimationState('block');
          break;
        case '2':
          setAnimationState('elbow');
          break;
        case '3':
          setAnimationState('punch');
          break;
        case '4':
          setAnimationState('hook');
          break;
        case '5':
          setAnimationState('roundHouseKick');
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === '1') { // For block, release returns to idle
        setAnimationState('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return null;
}

export default FightKeyBinds