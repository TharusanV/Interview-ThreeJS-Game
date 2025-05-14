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

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

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
        
  const yaw = useRef(0);                

  useEffect(() => {
    const handleMouseMove = (e) => {
      const deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      yaw.current -= deltaX * 0.002; // sensitivity adjustment
    };

    const enablePointerLock = () => {
      if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', enablePointerLock);
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', enablePointerLock);
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
        const moveDirection = new Vector3(movement.x, 0, movement.z).normalize();

        // Create a quaternion from the camera's Y rotation (yaw)
        const cameraYaw = new Vector3(0, 1, 0);
        const rotation = new Vector3(0, 0, 0);
        rotation.y = yaw.current;

        // Rotate movement vector by yaw
        moveDirection.applyAxisAngle(cameraYaw, rotation.y);

        vel.x = moveDirection.x * speed;
        vel.z = moveDirection.z * speed;
      }

      rb.current.setLinvel(vel, true);

      //Only rotate player when moving
      if ((movement.x !== 0 || movement.z !== 0) && player.current) {
        // Skip rotation if stepping backward only
        const isSteppingBack = movement.z === 1 && movement.x === 0;
        if (!isSteppingBack) {
          const moveDirection = new Vector3(movement.x, 0, movement.z).normalize();
          moveDirection.applyAxisAngle(new Vector3(0, 1, 0), yaw.current);

          let targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
          targetAngle += Math.PI; // compensate for model's base rotation

          const currentRotationY = player.current.rotation.y;
          player.current.rotation.y = lerpAngle(currentRotationY, targetAngle, 0.2);
        }
      }


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
