import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

import CharacterModel from '../../Entities/CharacterModel'

import { useGameStore } from "../../GlobalStateManager/useGameStore";

const Enemy1 = ({startingAnimationName = "idle", spawnPoint = [0.3, 0, -2], spawnRotation = [0, 0, 0] }) => {

  const isAttackingRef = useRef(false);
  const nextInputQueueRef = useRef([]); 
  const [animationState, setAnimationState] = useState(startingAnimationName);

  const canMove = useGameStore(state => state.canMove);

  return (
    <RigidBody position={spawnPoint} rotation={spawnRotation} colliders={false} lockRotations name="Enemy">
      {/* Physics capsule collider */}
      <CapsuleCollider position={[0,1.2,0]} args={[0.8, 0.3]} /> {/* radius = 0.5, height = 1*/}

      {/* Visual mesh */}
      <CharacterModel 
        modelPosition={[0, 0.2, -0.05]} 
        modelRotation={[0,0,0]} 
        isAttackingRef={isAttackingRef} nextInputQueueRef={nextInputQueueRef} animationState={animationState} setAnimationState={setAnimationState}
      />
      
    </RigidBody>
  )
}

export default Enemy1