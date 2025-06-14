import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshBasicMaterial, CylinderGeometry, DoubleSide, Color } from 'three'
import { RigidBody } from '@react-three/rapier'
import { degToRad } from 'three/src/math/MathUtils.js'

const ModelLoader = ({ rotation = [0, degToRad(270), 0], position = [0, 0, 0], scale = 1, ...props }) => {
  const { scene } = useGLTF('/parkMap.glb')

  return (
    <>
      <primitive
        object={scene}
        rotation={rotation}
        position={position}
        scale={scale}
        {...props}
      />
    
    </>
  )
}

export default ModelLoader