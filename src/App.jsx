import './App.css'

import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
  useHelper,
  Environment,
  useProgress,
  CameraShake,
} from '@react-three/drei'

import Menu from './UI/Menu'

import CustomCursor from './UI/CustomCursor'

import { useGameStore, gameStates } from './GlobalStateManager/useGameStore';

import MouseHandler from './Components/MouseHandler'
import { degToRad } from 'three/src/math/MathUtils.js'
import IntroGame from './Maps/IntroMaps/IntroGame' 

const CameraSetup = () => {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.rotation.y = degToRad(0) // Set initial Y rotation
    camera.rotation.x = degToRad(0);
    camera.rotation.z = degToRad(0);
    //console.log(camera.position);
  }, [camera])

  return null
}

const App = () => {
  const { progress } = useProgress();

  const currentLevel = useGameStore(state => state.level);
  const gameState = useGameStore((state) => state.gameState);
  const hasCinematicFinished = useGameStore((state) => state.hasCinematicFinished);

  return (
    <>
      <Canvas shadows style={{ background: 'black' }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[-40, 18, 70]} fov={50} />
          <CameraSetup />
          {/*<PointerLockControls/>*/}

          {(currentLevel == 0) && <IntroGame/>}

          <ContactShadows position={[0, -1.2, 0]} opacity={0.4} blur={2.5} />
        </Suspense>
      </Canvas>
      {progress === 100 && <Menu />}
      {progress === 100 && <CustomCursor />}
    </>

  )
}

export default App



/*
          <CameraShake
            maxYaw={0.02}       // side-to-side rotational sway
            maxPitch={0.01}     // slight forward-back tilt
            maxRoll={0.01}      // tiny tilt for realism
            yawFrequency={0.6}  // slow lateral oscillation
            pitchFrequency={0.5}
            rollFrequency={0.4}
            intensity={0.5}     // overall strength of shake
            decay={false}       // keep the shake constant
          />

          <PerspectiveCamera makeDefault position={[0, 1.6, 0]} fov={80} />

*/


//<PerspectiveCamera makeDefault position={[0.1, 2.3, 2.1]} fov={70} />