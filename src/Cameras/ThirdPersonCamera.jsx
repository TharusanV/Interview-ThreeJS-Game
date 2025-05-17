import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, AxesHelper } from 'three';
import { usePlayerStore } from '../GlobalStateManager/usePlayerStore'; // If you have player's position stored globally

// === Camera Configuration ===
const forwardOffsetDistance = 0;           // Distance in front of player
const verticalPivotOffset = 3.5;             // Pivot height above player's feet
const lateralOffsetFactor = 0.8;             // How far to offset sideways from center (e.g., shoulder cam)

const pivotFollowSmoothing = 0.1;            // How quickly pivot moves to follow player
const cameraFollowSmoothing = 0.1;           // How quickly camera moves to follow pivot
const cameraOrbitHeight = 0.5;                 // Height of camera above pivot
const cameraOrbitRadius = 3;                 // Distance of camera from pivot (orbit radius)


const ThirdPersonCamera = () => {
  const { camera, scene } = useThree();
  const angleRef = useRef(0); // Camera Y rotation
  const yawSensitivity = 0.002;

  const currentPivot = useRef(new Vector3());
  const playerPosition = new Vector3();

  // Visual helper (optional)
  useEffect(() => {
    const helper = new AxesHelper(1);
    scene.add(helper);
    helper.position.copy(currentPivot.current);
    return () => scene.remove(helper);
  }, [scene]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const deltaX = e.movementX || 0;
      angleRef.current -= deltaX * yawSensitivity;
    };

    const enablePointerLock = () => {
      if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', enablePointerLock);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', enablePointerLock);
    };
  }, []);

  useFrame((state, delta) => {
    const player = state.scene.getObjectByName('Player');
    if (!player) return;

    // Get player's world position
    player.getWorldPosition(playerPosition);

    // Desired pivot offset in front of player
    const forwardDirection = new Vector3(lateralOffsetFactor, 0, -1).applyQuaternion(player.quaternion);
    const desiredPivot = playerPosition
      .clone()
      .add(forwardDirection.multiplyScalar(forwardOffsetDistance))
      .setY(playerPosition.y + verticalPivotOffset);

    // Smoothly update pivot position
    currentPivot.current.lerp(desiredPivot, pivotFollowSmoothing);

    // Update AxesHelper 
    const helper = scene.children.find((c) => c instanceof AxesHelper);
    if (helper) helper.position.copy(currentPivot.current);

    // Compute camera position around pivot
    const angle = angleRef.current;
    const offsetX = Math.sin(angle) * cameraOrbitRadius;
    const offsetZ = Math.cos(angle) * cameraOrbitRadius;

    const desiredCameraPos = currentPivot.current.clone().add(new Vector3(offsetX, cameraOrbitHeight, offsetZ));

    // Smooth camera motion
    camera.position.lerp(desiredCameraPos, cameraFollowSmoothing);
    camera.lookAt(currentPivot.current);
  });

  return null;
};

export default ThirdPersonCamera;
