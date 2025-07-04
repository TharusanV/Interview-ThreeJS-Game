import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../../GlobalStateManager/useGameStore";
import { useZiplineManager } from "../../GlobalStateManager/useZiplineManager";

import { useMovementHandler } from "../../CustomHooks/useMovementHandler";

import { grabZipline, vaultOverObstacle, vaultOntoObstacle, wallRunSides, wallRunUp, climbUp, climbPipeLadder, basicJump} from "./usePlayerActions"

const MOVE_SPEED = 20;

const direction = new THREE.Vector3();

const Player = ({ spawnPoint = [0, 0, 0]}) => {
  const { camera } = useThree();
  
  const canMove = useGameStore((state) => state.canMove);
  const setCanMove = useGameStore((state) => state.setCanMove);
  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  const arrayOfZiplines = useZiplineManager((state) => state.ziplinePillars);
  
  const { forward, backward, left, right, spacebar} = useMovementHandler();

  const playerRef = useRef();

  const [isGrounded, setIsGrounded] = useState(false);
  const [canPerformAction, setCanPerformAction] = useState(false);

  const [nearZipline, setNearZipline] = useState(false);
  const [attachedToZipline, setAttachedToZipline] = useState(false);
  const ziplineDataRef = useRef({ start: null, end: null });
  const ziplineCooldownRef = useRef(0); 
  const ZIPLINE_COOLDOWN = 0.5; 

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef);
    }
  }, [playerRef]);



  useFrame(() => {
    if (!playerRef.current || !canMove) return;

    const velocity = playerRef.current.linvel();

    if(spacebar && nearZipline && !attachedToZipline){ // Attach logic
      const { start, end } = ziplineDataRef.current;
      if (start && end) {
        setAttachedToZipline(true);

        // Move player to the zipline start position
        playerRef.current.setTranslation(
          { x: start[0] - 3, y: start[1] - 2, z: start[2] },
          true
        );
      }
    }
    else if(spacebar && attachedToZipline){ // Manual detach
      setAttachedToZipline(false);
    }

    if (attachedToZipline) {
      const { start, end } = ziplineDataRef.current;

      const startVec = new THREE.Vector3(start[0], start[1], start[2]);
      const endVec = new THREE.Vector3(...end);

      const directionZipline = new THREE.Vector3().subVectors(endVec, startVec).normalize();
      const speedZipline = 10;
      const velocityZipline = directionZipline.multiplyScalar(speedZipline);

      playerRef.current.setLinvel({
        x: velocityZipline.x,
        y: velocityZipline.y,
        z: velocityZipline.z,
      });

      // Auto-detach when player gets close to end
      const playerPos = new THREE.Vector3();
      playerRef.current.getTranslation(playerPos);
      const distanceToEnd = playerPos.distanceTo(endVec);

      if (distanceToEnd < 3) {
        setAttachedToZipline(false);
      }

    }

    // Grounded jump
    if (!attachedToZipline && spacebar && isGrounded) {
      basicJump(playerRef);
      setCanPerformAction(false);
    }


    // <----- Movement based on camera direction ------->
    if (!attachedToZipline) {
      // Get camera direction
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
      } 
      else {
        if (velocity.x !== 0 || velocity.z !== 0) {
          playerRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 });
        }
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
            setIsGrounded(true); 
          }
        }}
        onCollisionExit={({other}) => {
          if(other.colliderObject.name === "ground"){
            setIsGrounded(false);
          }
        }}
      />


      <CuboidCollider sensor args={[2, 1.4, 2]} position={[0, 1.4 / 2, 0]}
        onIntersectionEnter={({other}) => {
          if(other.colliderObject.name.includes("zipline-pillar") && !attachedToZipline){
            const objName = other.colliderObject.name;
            const pillar = arrayOfZiplines.find(p => p.name === objName);
            if (pillar) {
              ziplineDataRef.current = { start: pillar.start, end: pillar.end};
              //console.log("Zipline data from store:", pillar);
              setNearZipline(true);
            }
          }
        }}
        onIntersectionExit={({other}) => {
          if(other.colliderObject.name.includes("zipline-pillar")){
            setNearZipline(false);
          }
        }}      
      />

      {/* Forward sensor */}
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



/*

    //Space events
    if (isGrounded) {
      if (!spacebar && prevSpacebarRef.current) {
        setTimeout(() => { setCanPerformAction(true); }, 0); // Spacebar was just released while grounded
      }
    }

    if (canPerformAction) {
      if(spacebar && isGrounded){
        basicJump(playerRef);
        setCanPerformAction(false);
      }
    }


*/