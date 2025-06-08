import './App.css'

import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useThree, extend } from '@react-three/fiber'
import {ContactShadows,OrbitControls,PerspectiveCamera,PointerLockControls,useHelper,Environment,useProgress,CameraShake,Sky,useGLTF,MeshPortalMaterial,CameraControls,Text} from '@react-three/drei'

import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import { EffectComposer } from '@react-three/postprocessing'
import BoatScene from './Scenes/BoatSceneFolder/BoatScene'




const App = () => {

  return (
    <Canvas shadows style={{ background: 'white' }}>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 10, 30]} fov={90} />
        <Sky/>
        <Environment preset='sunset'/>

        <BoatScene/>

      </Suspense>
    </Canvas>
  )
}

export default App
