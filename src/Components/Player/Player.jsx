import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

import CharacterModel from "../CharacterModel";

import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../../GlobalStateManager/useGameStore";
import { useMovementHandler } from "../../CustomHooks/useMovementHandler";

const MOVE_SPEED = 20;

const direction = new THREE.Vector3();

const Player = ({ spawnPoint = [0, 0, 0], modelScale }) => {
  const { camera } = useThree();
  const canMove = useGameStore((state) => state.canMove);
  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  const setAnimation = usePlayerStore((state) => state.setPlayerAnimation);

  const { forward, backward, left, right } = useMovementHandler();

  const playerRef = useRef();
  const modelGroupRef = useRef();

  const [animationState, setAnimationState] = useState("idle");

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef);
      setAnimation(animationState);
    }
  }, [playerRef, animationState]);

  useFrame(() => {
    if (!playerRef.current || !canMove) return;

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
      playerRef.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });

      setAnimationState("forward");
    } else {
      setAnimationState("idle");

      if (velocity.x !== 0 || velocity.z !== 0) {
        playerRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 });
      }
    }

    // Rotate character group based on camera yaw
    if (modelGroupRef.current && (animationState === "idle" || animationState === "forward")) {
      const yaw = Math.atan2(camDir.x, camDir.z);
      modelGroupRef.current.rotation.y = yaw;
    }
  });

  return (
    <RigidBody
      ref={playerRef}
      position={spawnPoint}
      colliders={false}
      lockRotations
      name="Player"
    >
      <CapsuleCollider position={[0, 0.875, 0]} args={[1.25, 0.25]} />

      <group ref={modelGroupRef} position={[0, -0.6, 0]} scale={modelScale || 0.0004}>
        <CharacterModel
          animationState={animationState}
          setAnimationState={setAnimationState}
        />
      </group>
    </RigidBody>
  );
};

export default Player;
