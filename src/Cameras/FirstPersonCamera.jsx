import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';

import { usePlayerStore } from "../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../GlobalStateManager/useGameStore";

import { useMovementHandler } from "../CustomHooks/useMovementHandler";

const FirstPersonCamera = ({
  sensitivity = 0.002,
  maxPitch = Math.PI / 2 - 0.1,
  minPitch = -Math.PI / 2 + 0.1
}) => {
  const { gl, camera, scene } = useThree();
  const playerRef = usePlayerStore((state) => state.playerRef);
  const canMove = useGameStore((state) => state.canMove);
  const { forward, backward, left, right } = useMovementHandler();

  const pitchRef = useRef(new THREE.Object3D());
  const yawRef = useRef(new THREE.Object3D());

  const isPointerLocked = useRef(false);

  useEffect(() => {
    // Set up camera hierarchy
    yawRef.current.add(pitchRef.current);
    pitchRef.current.add(camera);
    scene.add(yawRef.current);

    return () => {
      scene.remove(yawRef.current);
    };
  }, [camera, scene]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isPointerLocked.current) return;

      yawRef.current.rotation.y -= event.movementX * sensitivity;
      pitchRef.current.rotation.x -= event.movementY * sensitivity;

      // Clamp pitch rotation
      pitchRef.current.rotation.x = Math.max(
        minPitch,
        Math.min(maxPitch, pitchRef.current.rotation.x)
      );
    };

    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [sensitivity, minPitch, maxPitch, gl]);

  
useFrame(() => {
  if (!playerRef.current || !canMove) return;

  const pos = playerRef.current.translation();

  // Set position at player's eye height
  yawRef.current.position.set(pos.x, pos.y + 1.7, pos.z);

  // Calculate a forward vector pointing in the camera's look direction
  const forward = new THREE.Vector3(0, 0, -1); // forward in local space
  forward.applyQuaternion(yawRef.current.quaternion); // transform by current rotation

  // Move camera slightly ahead along the forward vector
  const lookAheadDistance = -5; 
  yawRef.current.position.add(forward.multiplyScalar(lookAheadDistance));
});

  return null;
};


export default FirstPersonCamera