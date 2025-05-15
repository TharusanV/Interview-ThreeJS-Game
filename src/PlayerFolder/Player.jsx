import React from 'react';
import LoadEntityModel from '../Components/LoadEntityModel'; 

const Player = ({
  isAttackingRef,
  nextInputQueueRef,
  animationState,
  setAnimationState
}) => {


  return (
    <LoadEntityModel
      modelUrlPath="/models/"
      animationState={animationState}
      setAnimationState={setAnimationState}
      isAttackingRef={isAttackingRef}
      nextInputQueueRef={nextInputQueueRef}
      color=""
      position={[0, 0, 0]}
      rotation={[0, -Math.PI, 0]}
      scale={[0.3, 0.3, 0.3]}
    />
  );
};

export default Player;
