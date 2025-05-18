import {useRef, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

import { useKeyboardHandling } from "../../CustomHooks/useKeyboardHandling";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = () => {

  const playerRef = useRef();
  const {forward, backward, left, right, shift} = useKeyboardHandling();

  useFrame((state) => {
    if (!playerRef.current) return;

    // moving player
    const velocity = playerRef.current.linvel();

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(state.camera.rotation);

    playerRef.current.wakeUp();
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

    // moving camera
    const {x, y, z} = playerRef.current.translation();
    state.camera.position.set(x, y, z);
  });

  return (
    <>
      <RigidBody colliders={false} mass={1} ref={playerRef} lockRotations>
        <mesh>
          <capsuleGeometry args={[0.5, 0.5]}/>
          <CapsuleCollider args={[0.75, 0.5]} />
        </mesh>
      </RigidBody>
    </>
  )
}

export default Player