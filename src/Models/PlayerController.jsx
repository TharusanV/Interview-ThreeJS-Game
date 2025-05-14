import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import Player from './Player';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from "leva";
import { Vector3, MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const WALK_SPEED = 0.8;
const RUN_SPEED = 1.6;

const PlayerController = ({ animationState, setAnimationState }) => {
  const rb = useRef();
  const container = useRef();
  const player = useRef();

  const cameraTarget = useRef();
  const cameraPivot = useRef();        
  const cameraPosition = useRef();

  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  const [, get] = useKeyboardControls();

  const isDragging = useRef(false);    
  const prevMouseX = useRef(0);         
  const yaw = useRef(0);                

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0) {
        isDragging.current = true;
        prevMouseX.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e) => {
      if (isDragging.current) {
        const deltaX = e.clientX - prevMouseX.current;
        yaw.current -= deltaX * 0.005; // adjust sensitivity
        prevMouseX.current = e.clientX;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(({ camera }) => {
    // Movement
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };
      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().forward) movement.z = -1;
      if (get().backward) movement.z = 1;
      if (get().left) movement.x = -1;
      if (get().right) movement.x = 1;

      if (movement.x !== 0 || movement.z !== 0) {
        vel.z = speed * movement.z;
        vel.x = speed * movement.x;
      }

      rb.current.setLinvel(vel, true);
    }

    // Rotate only the camera pivot (not container)
    if (cameraPivot.current) {
      cameraPivot.current.rotation.y = MathUtils.lerp(
        cameraPivot.current.rotation.y,
        yaw.current,
        0.1
      );
    }

    // Camera movement
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody ref={rb} colliders={false} lockRotations>
      <group ref={container}>
        <group ref={cameraTarget} position={[0, 1, 0]} />
        <group ref={cameraPivot} position={[0, 0, 0]}>
          <group ref={cameraPosition} position={[0, 2, 4]} />
        </group>
        <group ref={player}>
          <Player
            animationState={animationState}
            setAnimationState={setAnimationState}
          />
        </group>
      </group>
      <CapsuleCollider args={[0.7, 0.3]} position={[0, 1, 0]} />
    </RigidBody>
  );
};

export default PlayerController;
