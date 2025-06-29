import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';

import { usePlayerStore } from "../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../GlobalStateManager/useGameStore";

import { useMovementHandler } from "../CustomHooks/useMovementHandler";

const FirstPersonCamera = ({  cameraPosition = [0, 1.5, 0], cameraRotation = [0, 0, 0], }) => {
  const { gl, camera, scene } = useThree();

  const playerRef = usePlayerStore((state) => state.playerRef);
  const canMove = useGameStore((state) => state.canMove);

  const { forward, backward, left, right, spacebar } = useMovementHandler()

  const rotationY = useRef(0)
  const pitch = useRef(0)

  useEffect(() => {
    // Apply initial camera position and rotation
    camera.position.set(...cameraPosition)
    camera.rotation.set(...cameraRotation)
  }, [camera, cameraPosition, cameraRotation])

  useEffect(() => {
    const canvas = gl.domElement
    const isPointerLocked = () => document.pointerLockElement === canvas

    const onMouseMove = (e) => {
      if (!isPointerLocked()) return

      rotationY.current -= e.movementX * 0.002
      pitch.current += e.movementY * 0.002
      pitch.current = THREE.MathUtils.clamp(pitch.current, -Math.PI / 3, Math.PI / 3)
    }

    canvas.addEventListener('click', () => canvas.requestPointerLock())
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl])

  
  useFrame(() => {
    if (!playerRef.current || !canMove) return;

    // --- Update Camera Rotation (based on mouse input) ---
    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler(pitch.current, rotationY.current, 0, 'YXZ'))
    camera.quaternion.copy(quaternion)
    
    // --- Update Camera Position ---
    const playerPos = playerRef.current.translation()
    camera.position.set(playerPos.x, playerPos.y + cameraPosition[1], playerPos.z)

    // --- LOGGING INFO ---
    //const worldPos = new THREE.Vector3()
    //camera.getWorldPosition(worldPos)

    //console.log('Camera World Position:', worldPos)
    //console.log('Camera Height (Y):', worldPos.y.toFixed(2))
    //console.log('Camera Rotation (Euler):', camera.rotation)
    //console.log('Camera FOV:', camera.fov)
  });

  return null;
};


export default FirstPersonCamera