import { useState, useEffect } from "react"
import { Physics, RigidBody, useFixedJoint, CuboidCollider } from '@react-three/rapier'
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Sky, MeshReflectorMaterial, Gltf, OrbitControls, PivotControls, Outlines, Edges, CameraShake  } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

import LoadTrainModel from './LoadTrainModel'
import ModifiedCamera from '../../../Cameras/ModifiedCamera'
import PhoneMenu from "../../PhoneThings/PhoneUI";

const TrainScene = () => {

  const [startShake, setStartShake] = useState(false)

  // Delay shake until after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setStartShake(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>


      <Environment preset="night" background blur={1} />

      <LoadTrainModel/>


      {/* Only activate CameraShake after 2s */}
      
      {startShake && (
        <CameraShake
          maxYaw={0.2}     // Max amount camera can yaw in either direction
          maxPitch={0}    // Max amount camera can pitch in either direction
          maxRoll={0}    // Max amount camera can roll in either direction

          yawFrequency={0.25}   // Frequency of the the yaw rotation
          pitchFrequency={0}  // Frequency of the pitch rotation
          rollFrequency={0}  // Frequency of the roll rotation

          intensity={0.5}    // initial intensity of the shake
          decay={false}     // keep shaking forever
        />
      )}
      

    </>
  )
}

export default TrainScene