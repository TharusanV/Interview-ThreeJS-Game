import React from 'react'
import ModelLoader from './ModelLoader'
import { MirrorsEdgeChar } from '../../Components/Enemy/MirrorsEdgeChar'

import Player from '../../Components/Player/Player'

import { Physics, RigidBody, useFixedJoint } from '@react-three/rapier'
import { Environment, Sky, MeshReflectorMaterial, Gltf, OrbitControls, PivotControls  } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'
import { Ground } from './Ground'
import FirstPersonCamera from '../../Cameras/FirstPersonCamera'


const ParkourScene = () => {
  return (
    <>
      <Environment preset="sunset" background blur={1} />

      <Physics gravity={[0, -9.81, 0]} debug>
        <Player position={[0,0,0]}/>

        <RigidBody type="fixed" colliders="hull">
          <mesh name='floor' receiveShadow position={[0, 0, -40]} rotation-x={-Math.PI * 0.5} >
            <planeGeometry args={[15, 100]} />
            <meshStandardMaterial color="seagreen" />
          </mesh>
        </RigidBody>
      </Physics>


      <Building position={[0,216,-50]} args={[25,432,2]} color={"red"}/>

      <Building position={[0,1,-5]} args={[2,2,2]} color='blue'/>

      <FirstPersonCamera/>
        
    </>

  )
}

export default ParkourScene

const Panel = ({ position }) => (
  <mesh position={position} rotation={[-Math.PI / 4, 0, 0]}>
    <planeGeometry args={[1.5, 1]} />
    <meshStandardMaterial color="blue" />
  </mesh>
)

const Fence = ({ position }) => (
  <mesh position={position}>
    <boxGeometry args={[0.05, 1.5, 2]} />
    <meshStandardMaterial color="gray" />
  </mesh>
)

const Building = ({ position = [0,0,0], args=[1,0.4,1], color="red"}) => (
  <>
  
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  
  </>


  
)

/* 
      <group position={[3, 0.1, 0]} rotation={[0, 0, 0]} scale={2}>
        <Gltf src="parkMap.glb" />
      </group>

*/