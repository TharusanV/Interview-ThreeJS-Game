import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../../GlobalStateManager/useGameStore";
import { useMovementHandler } from "../../CustomHooks/useMovementHandler";

import { grabZipline, vaultOverObstacle, vaultOntoObstacle, wallRunSides, wallRunUp, climbUp, climbPipeLadder, basicJump} from "./usePlayerActions"

const MOVE_SPEED = 20;

const direction = new THREE.Vector3();

const Player = ({ spawnPoint = [0, 0, 0]}) => {
  const { camera } = useThree();
  
  const canMove = useGameStore((state) => state.canMove);
  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  const { forward, backward, left, right, spacebarHold, ctrlHold, spacebarPressed, ctrlPressed} = useMovementHandler();

  const playerRef = useRef();

  const currentAction = useRef(null);
  const traversalLock = useRef(false);

  const isGroundedRef = useRef(true);
  const isInAir = useRef(false);
  const isJumpingRef = useRef(false);
  const jumpDirectionRef = useRef(new THREE.Vector3());
  
  const aboveZipline = useRef(false);
  const belowZipline = useRef(false);
  const touchingWallLeft = useRef(false);
  const touchingWallRight = useRef(false);
  const touchingWallFront = useRef(false);
  const vaultBoxInFront = useRef(false);
  const isHanging = useRef(false);
  const pipeInFront = useRef(false);
  const ladderInFront = useRef(false);

  const canGrabZipline = (aboveZipline.current || belowZipline.current) && ((spacebarPressed && isGroundedRef.current) || isInAir.current);
  const canWallRunSide = (touchingWallLeft || touchingWallRight) && spacebarHold && forward;
  const canWallRunUp = touchingWallFront && (spacebarHold || spacebarPressed);
  const canVault = vaultBoxInFront && forward;
  const canClimb = isHanging && forward;
  const canPipeClimb = pipeInFront || ladderInFront;
  const canJump = spacebarHold && isGroundedRef.current && !isJumpingRef.current;

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

    //Space events
    //if (canGrabZipline) { grabZipline(spacebarPressed); currentAction.current = 'zipline'; } 
    //else if (canVault) { spacebarHold ? vaultOverObstacle(playerRef) : vaultOntoObstacle(playerRef); } 
    //else if (canWallRunSide) { wallRunSides(playerRef); currentAction.current = 'wallRunSides'; } 
    //else if (canWallRunUp) { wallRunUp(playerRef); currentAction.current = 'wallRunUp'; } 
    //else if (canClimb) { climbUp(playerRef); currentAction.current = 'climb'; } 
    //else if (canPipeClimb) { climbPipeLadder(playerRef); currentAction.current = 'climbPipeLadder'; } 
    if (canJump) { 
      basicJump(playerRef, isJumpingRef, isGroundedRef); 
      console.log(12345); 
      currentAction.current = 'basicJump'; 
    }
    

    //CTRL Events
    //if (highFallDetected){ rollOnLanding(); }
    //else if (isRunning){ slide(); }
    //else { crouch(); }

    // Movement based on camera direction
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
            console.log(1);
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
