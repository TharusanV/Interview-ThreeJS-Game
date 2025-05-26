import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

import CharacterModel from '../../Entities/CharacterModel'

import { useKeyboardHandling } from "../../CustomHooks/useKeyboardHandling";
import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../../GlobalStateManager/useGameStore";

const MOVE_SPEED = 8;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = ({modelScale}) => {
  const { camera } = useThree();

  const playerRef = useRef();
  const setPlayerRef = usePlayerStore(state => state.setPlayerRef);
  const setAnimation = usePlayerStore(state => state.setPlayerAnimation);

  const isAttackingRef = useRef(false);
  const nextInputQueueRef = useRef([]); 
  const [animationState, setAnimationState] = useState('idle');

  const canMove = useGameStore(state => state.canMove);
  const [spawnPoint, setSpawnPoint] = useState([0.3, 0, -2]); 

  const { forward, backward, left, right } = useKeyboardHandling();

  useEffect(() => {
    if (playerRef) {
      setPlayerRef(playerRef);
      setAnimation(animationState);
    }
  }, [playerRef]);


  useFrame((state) => {
    if (!playerRef.current) return;

    if(canMove){
      const velocity = playerRef.current.linvel();

      frontVector.set(0, 0, backward - forward);
      sideVector.set(left - right, 0, 0);
      direction.subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(MOVE_SPEED)
        .applyEuler(camera.rotation);

      playerRef.current.wakeUp();

      playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
    }
  });

  return (
    <RigidBody ref={playerRef} position={spawnPoint} colliders={false} lockRotations name="Player">
      {/* Physics capsule collider */}
      <CapsuleCollider position={[0,1.1,0]} args={[0.8, 0.3]} /> {/* radius = 0.5, height = 1*/}

      {/* Visual mesh */}
      <CharacterModel 
        modelPosition={[0, 0, -0.05]} 
        modelRotation={[0,0,0]}
        modelScale={modelScale} 
        isAttackingRef={isAttackingRef} nextInputQueueRef={nextInputQueueRef} animationState={animationState} setAnimationState={setAnimationState}
      />
      
    </RigidBody>
  );
};

export default Player;
