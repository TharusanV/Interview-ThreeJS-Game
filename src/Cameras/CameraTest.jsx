// CameraTest.jsx
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'

export default function CameraTest() {
  const { camera, gl } = useThree();
  const isActive = useRef(false);
  const [initialState, setInitialState] = useState(null);
  const keys = useRef({});
  const rotation = useRef({ x: 0, y: 3.5 });
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Capture initial camera state after 1s
  useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialState({
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
        fov: camera.fov
      });
      isActive.current = true;
    }, 1000);

    return () => clearTimeout(timeout);
  }, [camera]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => { keys.current[e.code] = true; };
    const handleKeyUp = (e) => { keys.current[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse events for camera rotation
  useEffect(() => {
    const handleMouseDown = (e) => {
      dragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    const handleMouseMove = (e) => {
      if (!dragging.current) return;

      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };

      rotation.current.y -= dx * 0.005;
      rotation.current.x -= dy * 0.005;
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
    };

    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement]);

  // Apply movement and rotation
  useFrame(() => {
    if (!isActive.current) return;

    const speed = 0.1;
    const direction = new THREE.Vector3();

    if (keys.current['ArrowUp']) direction.z -= 1;
    if (keys.current['ArrowDown']) direction.z += 1;
    if (keys.current['ArrowLeft']) direction.x -= 1;
    if (keys.current['ArrowRight']) direction.x += 1;

    direction.applyEuler(camera.rotation);
    camera.position.add(direction.multiplyScalar(speed));

    camera.rotation.x = rotation.current.x;
    camera.rotation.y = rotation.current.y;
  });

  return null;
}
