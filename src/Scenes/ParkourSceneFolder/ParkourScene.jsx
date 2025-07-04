import React, {useState, useRef, useEffect} from 'react'

import Player from '../../Components/Player/Player'

import { Physics, RigidBody, useFixedJoint, CuboidCollider } from '@react-three/rapier'
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Sky, MeshReflectorMaterial, Gltf, OrbitControls, PivotControls, Outlines, Edges  } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

import FirstPersonCamera from '../../Cameras/FirstPersonCamera'

import Level1 from '../Maps/Level1'
import { Level1Collision } from '../Maps/Level1Collision'

import Ziplines from './Ziplines';
import Zipline from './Zipline';

const ParkourScene = () => {
  return (
    <>
      <Environment preset="city" background blur={1} />

      <FirstPersonCamera/>

      <Physics gravity={[0, -16.4, 0]} debug>
        <Ground/>
        <Player/>

        <Ziplines />

        <Building position={[0,0,10]} args={[1,10,1]}/>
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

const Building = ({ position = [0, 0, 0], args = [1, 0.4, 1], color = "red" }) => {
  const halfHeight = args[1] / 2;

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Mesh positioned with its bottom at y = 0 */}
      <mesh position={[position[0], position[1] + halfHeight, position[2]]}>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
        <Edges linewidth={4} scale={1} color="black" />
      </mesh>

      {/* Collider also raised by half height */}
      <CuboidCollider
        name="ground"
        args={[args[0] / 2, args[1] / 2, args[2] / 2]}
        position={[position[0], position[1] + halfHeight, position[2]]}
      />
    </RigidBody>
  );
};

