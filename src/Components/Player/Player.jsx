import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

import CharacterModel from "../Enemy/CharacterModel";

import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../../GlobalStateManager/useGameStore";
import { useMovementHandler } from "../../CustomHooks/useMovementHandler";

const MOVE_SPEED = 20;

const JUMP_FORCE = 5;

const direction = new THREE.Vector3();

const Player = ({ spawnPoint = [0, 0, 0], modelScale }) => {
  const { camera } = useThree();
  const canMove = useGameStore((state) => state.canMove);
  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  const setAnimation = usePlayerStore((state) => state.setPlayerAnimation);
  const setIsGroundedRef = usePlayerStore((state) => state.setIsGroundedRef);
  

  const { forward, backward, left, right, spacebar } = useMovementHandler();

  const playerRef = useRef();
  const modelGroupRef = useRef();
  const isGroundedRef = useRef(true);

  const [animationState, setAnimationState] = useState("idle");
  
  const jumpFunction = () => {
    if(isGroundedRef.current){
      playerRef.current.applyImpulse({x: 0, y: JUMP_FORCE, z: 0})
    }
  }

  const valutFunction = () => {

  }

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef);
      setAnimation(animationState);
      setIsGroundedRef(isGroundedRef);
    }
  }, [playerRef, animationState]);


  useFrame(() => {
    if (!playerRef.current || !canMove) return;

    if(spacebar){
      jumpFunction();
    }

    const velocity = playerRef.current.linvel();

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, camera.up).normalize();

    direction.set(0, 0, 0);
    if (forward) direction.add(camDir);
    if (backward) direction.sub(camDir);
    if (left) direction.sub(camRight);
    if (right) direction.add(camRight);

    const isMoving = direction.lengthSq() > 0;

    if (isMoving) {
      direction.normalize().multiplyScalar(MOVE_SPEED);

      playerRef.current.wakeUp();
      playerRef.current.setLinvel({x: direction.x, y: velocity.y, z: direction.z,});

      setAnimationState("forward");
    } 
    
    else {
      if (velocity.x !== 0 || velocity.z !== 0) {
        playerRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 });
      }

      setAnimationState("idle");
    }

    // Rotate character group based on camera yaw
    if (modelGroupRef.current && (animationState === "idle" || animationState === "forward")) {
      const yaw = Math.atan2(camDir.x, camDir.z);
      modelGroupRef.current.rotation.y = yaw;
    }


    //const playerPos = playerRef.current.translation(); // Rapier.Vector3
    //console.log('Distance to player:', playerPos);

  });

  return (
    <RigidBody
      ref={playerRef}
      position={spawnPoint}
      colliders={false}
      lockRotations
      name="Player"
    >
      <CapsuleCollider position={[0, 0.875, 0]} args={[1.25, 0.25]} 
        onCollisionEnter={({other}) => {
          if(other.rigidBodyObject.name === "ground"){
            isGroundedRef.current = true;
          }
        }}
        onCollisionExit={({other}) => {
          if(other.rigidBodyObject.name === "ground"){
            isGroundedRef.current = false;
          }
        }}
      />

      
    </RigidBody>
  );
};

export default Player;
