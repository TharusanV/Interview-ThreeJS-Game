import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect, useState } from 'react';

const CustomCamera = ({ view = 'first' }) => {
  const cameraRef = useRef();

  useFrame(() => {
    if (!cameraRef.current) return;

    if (view === 'third') {
      cameraRef.current.position.set(0, 0.9, 0.8);
      cameraRef.current.rotation.set(0, 0, 0); 
    } 
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={90}
      near={0.1}
      far={100}
      position={[0, 0, 0]}
    />
  );
};

export default CustomCamera;
