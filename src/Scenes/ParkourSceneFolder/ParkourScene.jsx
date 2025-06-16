import React, {useState, useRef, useEffect} from 'react'
import ModelLoader from './ModelLoader'
import { MirrorsEdgeChar } from '../../Components/Enemy/MirrorsEdgeChar'

import Player from '../../Components/Player/Player'

import { Physics, RigidBody, useFixedJoint, CuboidCollider } from '@react-three/rapier'
import { Environment, Sky, MeshReflectorMaterial, Gltf, OrbitControls, PivotControls, Outlines, Edges  } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

import FirstPersonCamera from '../../Cameras/FirstPersonCamera'
import ModelWithCamera from '../../Cameras/ModelWithCamera'

import useRoadTexture from '../../CustomTextures/RoadMaterial'


const ParkourScene = () => {
  return (
    <>
      <Environment preset="sunset" background blur={1} />

      <Physics gravity={[0, -16, 0]} debug>
        <ModelWithCamera/>
        <Ground/>

        <JumpingBlock position={[0,0,-5]} args={[2,2,2]} color='orange'/>
      </Physics>


      <Building position={[0,216 - 1, 40]} args={[25,432,2]} color={"red"}/>


      <Road args={[4, 100]}/>

        
    </>

  )
}

export default ParkourScene

const Ground = () => {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      name="ground"
    >
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"seagreen"} />
      </mesh>
      
      <CuboidCollider args={[50, 1, 50]} position={[0, -2, 0]} />
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

const JumpingBlock = ({ position = [0, 0, 0], args = [1, 0.4, 1], color = "red" }) => {
  const [width, height, depth] = args;

  const topFaceHeight = 0.01;
  const topFaceY = position[1] + height / 2 + topFaceHeight / 2;

  // Collider padding to prevent clipping
  const padding = 0.5;

  return (
    <>
      {/* Top face - the "ground" */}
      <RigidBody type="fixed" colliders={false} name="ground">
        <mesh position={[position[0], topFaceY, position[2]]}>
          <boxGeometry args={[width, topFaceHeight, depth]} />
          <meshStandardMaterial color="green" />
          <Edges linewidth={2} scale={1} color="black" />
        </mesh>
        <CuboidCollider
          args={[
            width / 2 + padding / 2,
            topFaceHeight / 2 + padding / 2,
            depth / 2 + padding / 2,
          ]}
          position={[position[0], topFaceY, position[2]]}
        />
      </RigidBody>

      {/* All other sides - the "wall" */}
      <RigidBody type="fixed" colliders={false} name="wall">
        <mesh position={position}>
          <boxGeometry args={args} />
          <meshStandardMaterial color={color} />
          <Edges linewidth={2} scale={1} color="black" />
        </mesh>
        <CuboidCollider
          args={[
            width / 2 + padding / 2,
            height / 2 + padding / 2,
            depth / 2 + padding / 2,
          ]}
          position={position}
        />
      </RigidBody>
    </>
  );
};


const Road = ({position = [0,0,0], args=[1,1]}) => {
  const roadTexture = useRoadTexture()

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={args} />
      <meshStandardMaterial map={roadTexture} />
    </mesh>
  );
};

/* 
      <group position={[3, 0.1, 0]} rotation={[0, 0, 0]} scale={2}>
        <Gltf src="parkMap.glb" />
      </group>

*/