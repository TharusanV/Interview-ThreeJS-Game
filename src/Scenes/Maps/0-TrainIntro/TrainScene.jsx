import { Physics, RigidBody, useFixedJoint, CuboidCollider } from '@react-three/rapier'
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Sky, MeshReflectorMaterial, Gltf, OrbitControls, PivotControls, Outlines, Edges  } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

import LoadTrainModel from './LoadTrainModel'
import ModifiedCamera from '../../../Cameras/ModifiedCamera'

const TrainScene = () => {
  return (
    <>


      <Environment preset="night" background blur={1} />

      <LoadTrainModel/>
    </>
  )
}

export default TrainScene