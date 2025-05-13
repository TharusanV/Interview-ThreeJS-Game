import './App.css'

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera} from '@react-three/drei';
import * as THREE from 'three';

import Player from './Models/Player';
import CustomCamera from './CustomCamera';

const App = () => {
  const [animationState, setAnimationState] = useState('idle');
  const [runningAttackAnimation, setRunningAttackAnimation] = useState(false);

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
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      // For block, release returns to idle
      if (e.key === '1') {
        setAnimationState('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  return (
    <Canvas shadows>
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

        {/*Camera */}
        <PerspectiveCamera makeDefault position={[0.2, 0.5, 1]}  fov={75} /> 
        <OrbitControls
          target={[0.2, 1, 0]}
          enablePan={false}    
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={1}
          maxDistance={5}
        />
        
      </Suspense>
    </Canvas>
  )
}

export default App
