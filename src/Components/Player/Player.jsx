import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../../GlobalStateManager/useGameStore";
import { useMovementHandler } from "../../CustomHooks/useMovementHandler";

import { useStandardJump, useBoxJump } from "./useJump";

const MOVE_SPEED = 20;

const direction = new THREE.Vector3();

const Player = ({ spawnPoint = [0, 0, 0]}) => {
  const { camera } = useThree();
  
  const canMove = useGameStore((state) => state.canMove);
  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  const { forward, backward, left, right, spacebarHold, jumpReleased, setJumpReleased } = useMovementHandler();

  const playerRef = useRef();
  const isGroundedRef = useRef(true);

  const isJumpingRef = useRef(false);
  const jumpDirectionRef = useRef(new THREE.Vector3());
  const hasQueuedBoxJump = useRef(false);
  const boxJumpTimerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef);
    }
  }, [playerRef]);


  useFrame(() => {
    if (!playerRef.current || !canMove) return;

    // Get camera direction
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, camera.up).normalize();


  if (spacebarHold && jumpReleased && isGroundedRef.current && !isJumpingRef.current) {
    // Store camera direction when jump is initiated
    jumpDirectionRef.current.copy(camDir);

    // Execute standard jump
    useStandardJump(playerRef);
    setJumpReleased(false);
    isJumpingRef.current = true;
    isGroundedRef.current = false;

    // Schedule box jump after 2s
    hasQueuedBoxJump.current = true;
    clearTimeout(boxJumpTimerRef.current); // Prevent overlap
    
    boxJumpTimerRef.current = setTimeout(() => {
      if (playerRef.current && hasQueuedBoxJump.current) {
        useBoxJump(playerRef, jumpDirectionRef.current);
        hasQueuedBoxJump.current = false;
      }
    }, 1000);
  }

    // Movement
    direction.set(0, 0, 0);
    if (forward) direction.add(camDir);
    if (backward) direction.sub(camDir);
    if (left) direction.sub(camRight);
    if (right) direction.add(camRight);

    const velocity = playerRef.current.linvel();
    const isMoving = direction.lengthSq() > 0;

    if (isMoving) {
      direction.normalize().multiplyScalar(MOVE_SPEED);
      playerRef.current.wakeUp();
      playerRef.current.setLinvel({x: direction.x, y: velocity.y, z: direction.z,});
    } 
    else {
      if (velocity.x !== 0 || velocity.z !== 0) {
        playerRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 });
      }
    }
  });

  return (
    <RigidBody
      ref={playerRef}
      position={spawnPoint}
      colliders={false}
      type="dynamic"
      mass={1}
      lockRotations
      name="Player"
    >
      <CapsuleCollider position={[0, 1.6/2, 0]} args={[(1.6 - 2 * 0.25) / 2, 0.5 / 2]} 
        onCollisionEnter={({other}) => {
          if(other.colliderObject.name === "ground"){
            isGroundedRef.current = true; 
            isJumpingRef.current = false; 
          }
        }}
        onCollisionExit={({other}) => {
          if(other.colliderObject.name === "ground"){
            isGroundedRef.current = false; 
            isJumpingRef.current = true; 
            //console.log(1);
          }
        }}
      />

      {/* Forward side sensor */}
      <CuboidCollider
        sensor
        args={[0.2, 0.5, 0.5]}
        position={[0, 0.8, 1]}
        onIntersectionEnter={({ other }) => {
          //console.log('Front wall detected:', other)
        }}
      />

      {/* Left side sensor */}
      <CuboidCollider
        sensor
        args={[0.1, 0.5, 0.3]}
        position={[-0.6, 0.8, 0]}
        onIntersectionEnter={({ other }) => {
          //console.log('Left wall detected:', other)
        }}
      />

      {/* Right side sensor */}
      <CuboidCollider
        sensor
        args={[0.1, 0.5, 0.3]}
        position={[0.6, 0.8, 0]}
        onIntersectionEnter={({ other }) => {
          //console.log('Right wall detected:', other)
        }}
      />
      
    </RigidBody>
  );
};

export default Player;
