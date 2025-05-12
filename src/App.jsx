import './App.css'

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls} from '@react-three/drei';
import * as THREE from 'three';

import Player from './Models/Player';

const App = () => {
  const [animationState, setAnimationState] = useState('idle');

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
        {/*
        <mesh position={[0, 0, 0]} >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        */}

        <Player animationState={animationState}/>

        {/*Moving Camera through Orbit Controls */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}

export default App
