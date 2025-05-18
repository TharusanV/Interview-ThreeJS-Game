import './App.css'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { AxesHelper } from 'three'

import { InterogationRoom } from './MapObj/InterogationRoom'
import { Subway } from './MapObj/Subway'

function Helpers() {
  return <primitive object={new AxesHelper(5)} />
}

const App = () => {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[8, 0, 5]} fov={70} />
      <OrbitControls target={[10, 2, 0]} />

      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={4}
      />

      <Helpers />

      <Subway rotation={[0, 0, 0]} position={[0, 0, 0]} scale={1} />
    </Canvas>
  )
}

export default App
