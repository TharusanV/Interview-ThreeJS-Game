import LoadEntityModel from '../Components/LoadEntityModel'; 

const BasicEnemy = ({
  isAttackingRef,
  nextInputQueueRef,
  animationState,
  setAnimationState,
  position,
}) => {
  return (
    <LoadEntityModel
      modelUrlPath="/models/"
      animationState={animationState}
      setAnimationState={setAnimationState}
      isAttackingRef={isAttackingRef}
      nextInputQueueRef={nextInputQueueRef}
      color="#ff0000"
      position={position}
      rotation={[0, -Math.PI, 0]}
      scale={[0.3, 0.3, 0.3]}
    />
  )
}

export default BasicEnemy