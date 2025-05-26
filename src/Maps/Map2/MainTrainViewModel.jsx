import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshBasicMaterial, CylinderGeometry, DoubleSide } from 'three'
import { RigidBody } from '@react-three/rapier'

export function  MainTrainViewModel({ rotation = [0, 0, 0], position = [0, 0.692, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/models/Maps/IntroMap/MainTrainViewModel.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        // prevent receiving shadows
        // child.receiveShadow = false
      }
    })
  }, [scene])

  return (
    <>
      <primitive
        object={scene}
        rotation={rotation}
        position={position}
        scale={scale}
        {...props}
      />

      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh onPointerDown={console.log} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <boxGeometry args={[5, 12, 0.3]} /> {/* width, depth, height */}
        </mesh>
      </RigidBody>

    </>
  )
}

useGLTF.preload('/models/Maps/IntroMap/MainTrainViewModel.glb')
