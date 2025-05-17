import './App.css'

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree  } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats, Sphere, Box } from '@react-three/drei';
import { AxesHelper, Vector3  } from 'three';

import { Physics, RigidBody } from '@react-three/rapier';
import Map from './Entities/Map';

import ModelWithSize from './Utils/ModelWithSize';
import Player from './Entities/Player/Player';
import ThirdPersonCamera from './Cameras/ThirdPersonCamera';

const App = () => {  

  

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={70}/>
      <ThirdPersonCamera />

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 10]} intensity={1} />
      
      
      <Physics gravity={[0, -9.81, 0]} debug>
        <Map/>
        <Player/>
      </Physics>
      
      <Stats />
      
    </Canvas>
  )
}

export default App
