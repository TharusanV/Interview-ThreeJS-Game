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

import { Physics, RigidBody } from '@react-three/rapier'

import { degToRad } from 'three/src/math/MathUtils.js'

import { MainTrainViewModel } from './MainTrainViewModel'
import Enemy1 from '../../Entities/Enemy/Enemy1'

const Map2Cinematic = () => {
  return (
    <>
      <Environment preset="city" /> {/* Or "sunset", "city", "night", etc. */}

      <Physics gravity={[0, -9.81, 0]} debug>
        <MainTrainViewModel rotation={[0, degToRad(90), 0]} position={[0.5,0,-8]} scale={[1,1,1]}/>

        <Enemy1 startingAnimationName={'sitTalk1'} spawnPoint={[-1.0,0,-3.7]} spawnRotation={[0, degToRad(90), 0]}/>
        <Enemy1 startingAnimationName={'sitTalk2'} spawnPoint={[-1.0,0,-4.2]} spawnRotation={[0, degToRad(90), 0]}/>
      </Physics>

    
    </>
  )
}

export default Map2Cinematic