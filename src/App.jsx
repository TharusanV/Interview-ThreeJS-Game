import './App.css'

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, KeyboardControls} from '@react-three/drei';
import * as THREE from 'three';

import { Physics, RigidBody } from '@react-three/rapier';
import PlayerController from './PlayerFolder/PlayerController';


const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const App = () => {
  const [cameraPosition, setCameraPosition] = useState([0.2, 0.8, 1.2]); // Starting camera position
  const [animationState, setAnimationState] = useState('idle');
  const [runningAttackAnimation, setRunningAttackAnimation] = useState(false);

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas shadows camera={cameraPosition} fov={10}>
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

          {/* All Objects are placed here to allow for physics*/}
          <Physics gravity={[0, -9.81, 0]} debug>
            {/* Ground */}
            <RigidBody type="fixed" colliders="trimesh">
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </RigidBody>

            {/* Falling object */}
            {/*
            <RigidBody>
              <mesh castShadow position={[0, 12, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </RigidBody>
            */}

            <PlayerController animationState={animationState} setAnimationState={setAnimationState}/>
          </Physics>
          
        </Suspense>
      </Canvas>
    </KeyboardControls>
    
  )
}

export default App
