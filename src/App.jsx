import './App.css'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useThree, extend } from '@react-three/fiber'
import {ContactShadows,OrbitControls,PerspectiveCamera,PointerLockControls,useHelper,Environment,useProgress,CameraShake,Sky,useGLTF,MeshPortalMaterial,CameraControls,Text} from '@react-three/drei'

import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import TrainScene from './Scenes/Maps/0-TrainIntro/TrainScene'
import ConstantMenu from './Scenes/UI/ConstantMenu'
import CustomCursor from './Scenes/UI/CustomCursor'
import PhoneUI from './Scenes/PhoneThings/PhoneUI'


const App = () => {
  const [sceneNum, setSceneNum] = useState(0);
  const eyeHeight = 1.75

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.2, 0]} fov={90} />

          {sceneNum === 0 && <TrainScene/>}

          <EffectComposer>
           <Bloom
              mipmapBlur
              luminanceThreshold={1} // glow when > 1
              intensity={1}        // overall bloom brightness
            />
          </EffectComposer>

        </Suspense>
      </Canvas>
      

      {/*<ConstantMenu/>*/} 
      <PhoneUI/>
      
    </div>
  )
}

export default App

