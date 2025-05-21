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
} from '@react-three/drei'

import Menu from './UI/Menu'

import CustomCursor from './UI/CustomCursor'

import { useGameStore } from './GlobalStateManager/useGameStore'
import Map1 from './Maps/Map1'

const CameraSetup = () => {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.rotation.y = Math.PI // Set initial Y rotation (180 degrees)
    //console.log(camera.position);
  }, [camera])

  return null
}



const App = () => {
  const { progress } = useProgress();

  const currentLevel = useGameStore(state => state.level);

  return (
    <>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 2.4, 14]} fov={70} />
          <CameraSetup />

          {currentLevel == 1 && <Map1 />}
      
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
        <Subway rotation={[0, 0, 0]} position={[0, 0, 0]} scale={1} />

        <RigidBody type="fixed" colliders="trimesh">
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[4.25, 1.117, -14.6]}>
            <planeGeometry args={[5.19, 65]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

*/