import './App.css'

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, KeyboardControls, Stats} from '@react-three/drei';
import * as THREE from 'three';

import { Physics, RigidBody } from '@react-three/rapier';
import Map from './Entities/Map';
import CameraRig from './Entities/CameraRig';
import Box from './Entities/Box';
import { useGameStore } from './Entities/useGameStore';
import ModelWithSize from './Entities/ModelWithSize';

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const App = () => {  

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas camera={{ position: [0, 2, 5], fov: 70 }}>
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        
        <CameraRig />
        
        <Box />

        <gridHelper args={[50, 50]} />
        <Stats />
      </Canvas>
    </KeyboardControls>
    
  )
}

export default App
