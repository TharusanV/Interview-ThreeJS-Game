import React, {useState, useRef, useEffect} from 'react'

import Player from '../../Components/Player/Player'

import { Physics, RigidBody, useFixedJoint, CuboidCollider } from '@react-three/rapier'
import { Environment, Sky, MeshReflectorMaterial, Gltf, OrbitControls, PivotControls, Outlines, Edges  } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

import FirstPersonCamera from '../../Cameras/FirstPersonCamera'

import Level1 from '../Maps/Level1'
import { Level1Collision } from '../Maps/Level1Collision'

const ParkourScene = () => {
  return (
    <>
      <Environment preset="city" background blur={1} />

      <FirstPersonCamera/>

      <Physics gravity={[0, -16.4, 0]} debug>
        <Ground/>
        <Player/>
      </Physics>
    </>

  )
}

export default ParkourScene

const Ground = () => {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
    >
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"seagreen"} />
      </mesh>
      
      <CuboidCollider name="ground" args={[50, 1, 100]} position={[0, -1, 0]} />
    </RigidBody>
  );
};

const Building = ({position = [0,0,0], args=[1,0.4,1], color="red"}) => {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
      <Edges linewidth={4} scale={1} color="black" />
    </mesh>
  );
};
