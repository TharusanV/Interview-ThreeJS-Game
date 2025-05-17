import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, AxesHelper } from 'three';

const pivot = new Vector3(0, 0.5, -4);

const ThirdPersonCamera = () => {
  const { camera, scene } = useThree();
  const angleRef = useRef(0); // Horizontal rotation angle (Y-axis)
  const distanceRef = useRef(5); // Distance from the pivot
  const yawSensitivity = 0.002;

  // Save initial camera state (optional)
  const cameraState = useRef({
    position: camera.position.clone(),
    rotation: camera.rotation.clone(),
    fov: camera.fov,
  });

  // Add an AxesHelper to visualize the pivot point
  useEffect(() => {
    const helper = new AxesHelper(1);
    helper.position.copy(pivot);
    scene.add(helper);

    return () => {
      scene.remove(helper);
    };
  }, [scene, pivot]);

  // Handle mouse movement + pointer lock
  useEffect(() => {
    const handleMouseMove = (e) => {
      const deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      angleRef.current -= deltaX * yawSensitivity;
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
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, []);

  // Update camera 
  useFrame(() => {
    //angleRef tracks how far the camera has been rotated horizontally around the Y-axis.
    //The value is modified by mouse movement (angleRef.current -= deltaX * sensitivity in the mouse handler).
    const angle = angleRef.current;

    //This determines how far the camera should stay from the pivot point - could later make this dynamic to allow zooming in/out
    const distance = distanceRef.current;

    const x = pivot.x + Math.sin(angle) * distance;
    const z = pivot.z + Math.cos(angle) * distance;
    const y = pivot.y + 2; // Camera height

    //Moves the camera to the computed position. It stays at a constant radius and height, but orbits around the pivot.
    camera.position.set(x, y, z);
    //This ensures the camera is always facing the pivot point, no matter where it is.
    camera.lookAt(pivot);
  });

  return null;
};

export default ThirdPersonCamera;
