import './App.css'

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, KeyboardControls} from '@react-three/drei';
import * as THREE from 'three';

import { Physics, RigidBody } from '@react-three/rapier';
import PlayerController from './PlayerFolder/PlayerController';
import BasicEnemyController from './Enemies/BasicEnemyController';
import CameraController from './Components/CameraController';


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
      <Canvas shadows camera={[0.2, 0.8, 1.2]} fov={10}>
        <Suspense fallback={null}>
          <CameraController/>

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* All Objects are placed here to allow for physics*/}
          <Physics gravity={[0, -9.81, 0]} debug>
            {/* Ground */}
            <RigidBody type="fixed" colliders="trimesh">
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </RigidBody>
            
            <PlayerController />
            {/*<BasicEnemyController position={[0, 0, -3]} />*/}
            
          </Physics>
          
        </Suspense>
      </Canvas>
    </KeyboardControls>
    
  )
}

export default App
