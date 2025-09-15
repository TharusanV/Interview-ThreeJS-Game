// LoadTrainModel.jsx
import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Color } from 'three'
import { useThree } from '@react-three/fiber'

export default function LoadTrainModel(props) {
  const { scene } = useGLTF('/SceneModels/newTrain.glb')
  const { set } = useThree()

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const matName = child.material.name

        if (matName === 'WhiteLightMaterial') {
          child.material.emissive = new Color(0xffffff)
          child.material.emissiveIntensity = 1.1
          child.material.toneMapped = false
        } 
        else if (matName === 'LEDMaterial') {
          child.material.emissive = new Color(0xffffff)
          child.material.emissiveIntensity = 1.5
          child.material.toneMapped = false
        } 
        else if (matName === 'YellowLightMaterial') {
          child.material.emissive = new Color(0xffff00)
          child.material.emissiveIntensity = 3
          child.material.toneMapped = false
        } 
        else if (matName === 'BlueLightMaterial') {
          child.material.emissive = new Color(0x00fbff)
          child.material.emissiveIntensity = 1.5
          child.material.toneMapped = false
        }
      }
    })

    // Look for a camera exported from Blender
    const blenderCam = scene.getObjectByName('ViewCamera')
    if (blenderCam) {
      blenderCam.aspect = window.innerWidth / window.innerHeight
      blenderCam.updateProjectionMatrix()
      set({ camera: blenderCam }) // Replace default R3F camera
    }
  }, [scene, set])

  return <primitive object={scene} {...props} />
}

useGLTF.preload('/SceneModels/newTrain.glb')
