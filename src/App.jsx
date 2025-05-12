import './App.css'

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const App = () => {


  return (
    <Canvas shadows camera={{ position: [2, 2, 4], fov: 50 }}>
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Objects */}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Optional: Orbit Controls */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}

export default App
