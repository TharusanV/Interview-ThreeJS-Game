import './App.css'

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls} from '@react-three/drei';
import * as THREE from 'three';

import Player from './Models/Player';

const App = () => {
  const [animationState, setAnimationState] = useState('roundHouseKick');

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
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="white" />
        </mesh>
    
        <Player animationState={animationState}/>

        {/*Moving Camera through Orbit Controls */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}

export default App
