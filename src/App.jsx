import './App.css'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, PivotControls, PointerLockControls } from '@react-three/drei'
import { AxesHelper } from 'three'

import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import Player from './Entities/Player/Player'
import Floor from './MapObj/Floor'
import { PlayerPistol } from './Entities/Player/PlayerPistol'
import { InterogrationRoom } from './MapObj/InterogrationRoom'
import FracturedModel from './Entities/Enemy1/FracturedModel'
import { CharacterModel } from './Entities/CharacterModel'

const App = () => {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[4, 2.4, 14]} fov={70} />
      <PointerLockControls />

      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight
        position={[0, 0.5, -0.3]}
        intensity={2.5}
      />


      <InterogrationRoom />

      <Physics gravity={[0, -9.81, 0]} debug>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[5, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        <Player/>

        <CharacterModel />



        <RigidBody type="fixed" colliders="trimesh">
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </RigidBody>
      </Physics>

      
    </Canvas>
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