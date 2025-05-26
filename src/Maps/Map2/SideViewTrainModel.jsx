import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export function SideViewTrainModel({ rotation = [0, 0, 0], position = [0, 0, 0], scale = [1,1,1], ...props }) {
  const { scene } = useGLTF('/models/Maps/IntroMap/sideTrainViewModel.glb')

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
    <primitive
      object={scene}
      rotation={rotation}
      position={position}
      scale={scale}
      {...props}
    />
  )
}

useGLTF.preload('/models/Maps/IntroMap/sideTrainViewModel.glb')
