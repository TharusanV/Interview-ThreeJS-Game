import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from "leva";
import { Vector3, MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useZustandStore } from './useZustandStore';

const CameraController = () => {
  const cameraTargetRef = useZustandStore((state) => state.cameraTargetRef);
  const cameraPivotRef = useZustandStore((state) => state.cameraPivotRef);
  const cameraPositionRef = useZustandStore((state) => state.cameraPositionRef);
  const yawRef = useZustandStore((state) => state.yawRef);

  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  useFrame(({ camera }) => {
    // CAMERA ROTATION - Rotate only the camera pivot (not container)
    /*
    if (cameraPivotRef.current) {
      cameraPivotRef.current.rotation.y = MathUtils.lerp(
        cameraPivotRef.current.rotation.y,
        yawRef.current,
        0.1
      );
    }
    */
   
    // Camera movement
    cameraPositionRef.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTargetRef.current) {
      cameraTargetRef.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });


  return null
}

export default CameraController