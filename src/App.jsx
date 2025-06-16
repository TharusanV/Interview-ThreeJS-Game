import './App.css'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useThree, extend } from '@react-three/fiber'
import {ContactShadows,OrbitControls,PerspectiveCamera,PointerLockControls,useHelper,Environment,useProgress,CameraShake,Sky,useGLTF,MeshPortalMaterial,CameraControls,Text} from '@react-three/drei'

import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import { EffectComposer } from '@react-three/postprocessing'


import ParkourScene from './Scenes/ParkourSceneFolder/ParkourScene'


const App = () => {
  const [sceneNum, setSceneNum] = useState(1);
  const eyeHeight = 1.75

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMappingExposure: 1.2 }}
    >
      <Suspense fallback={null}>
         
         <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={90} />

        {sceneNum === 1 && <ParkourScene/>}
      </Suspense>
    </Canvas>
  )
}

export default App

/*
        <Environment preset="city" />

        <Sky/>

        {sceneNum === 0 && <BoatScene/>}
        {sceneNum === 1 && <ParkourScene/>}

*/