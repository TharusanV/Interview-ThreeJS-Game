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
import { DirectionalLightHelper } from 'three'

import { Physics, RigidBody } from '@react-three/rapier'

import Menu from './UI/Menu'

import Player from './Entities/Player/Player'
import { InterogrationRoom } from './MapObj/InterogrationRoom'
import CharacterModel from './Entities/CharacterModel'
import CustomCursor from './UI/CustomCursor'
import MouseLookController from './Components/MouseLookController'

const CameraSetup = () => {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.rotation.y = Math.PI // Set initial Y rotation (180 degrees)
  }, [camera])

  return null
}

const Lights = () => {
  const mainLight = useRef()

  useHelper(mainLight, DirectionalLightHelper, 1, 'hotpink')

  return (
    <>
      <ambientLight intensity={0.1} />

      <directionalLight
        ref={mainLight}
        position={[8, 5, 5]}
        intensity={0.5}
        castShadow
      />

      {mainLight.current && (
        <primitive object={mainLight.current.target} position={[0, 0, 0]} />
      )}

      <directionalLight position={[-5, -3, -10]} intensity={0.1} />
    </>
  )
}

const App = () => {
  const { progress } = useProgress();

  return (
    <>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 2.4, 14]} fov={70} />
          <CameraSetup />
          <MouseLookController/> 

          <Lights />

          <ContactShadows position={[0, -1.2, 0]} opacity={0.4} blur={2.5} />

          <CharacterModel />
          <InterogrationRoom />

          <Physics gravity={[0, -9.81, 0]} debug>
            <RigidBody type="fixed" colliders="trimesh">
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[5, 8]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </RigidBody>

            <Player />
          </Physics>
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