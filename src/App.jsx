import './App.css'

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls} from '@react-three/drei';
import * as THREE from 'three';

import Player from './Models/Player';

const App = () => {
  const [animationState, setAnimationState] = useState('roundHouseKick');

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case '1':
          setAnimationState('block');
          break;
        case '2':
          setAnimationState('elbow');
          break;
        case '3':
          setAnimationState('punch');
          break;
        case '4':
          setAnimationState('hook');
          break;
        case '5':
          setAnimationState('roundHouseKick');
          break;
        case '0':
          setAnimationState('idle');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


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
    
        <Player animationState={animationState} setAnimationState={setAnimationState}/>

        {/*Moving Camera through Orbit Controls */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}

export default App
