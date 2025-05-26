import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshBasicMaterial, CylinderGeometry, DoubleSide, Color } from 'three'
import { RigidBody } from '@react-three/rapier'

export function Hallway({ rotation = [0, 0, 0], position = [0, 0.1, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/models/Maps/IntroMap/Level0.glb')

  const whiteMaterial = new MeshStandardMaterial({
    color: new Color(1, 1, 1),  
    roughness: 1,            
    metalness: 0,              
  })

  const refinedWhiteMaterial = new MeshStandardMaterial({
    color: new Color(0.92, 0.92, 0.92), 
    roughness: 1,
    metalness: 0,
  });


  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Hide RightWall
        if (child.name === 'RightWall') {
          //console.log(child.name);
          child.visible = false;
          return;
        } 
        
        //Apply material
        if (child.name.startsWith('Door')) {
          child.material = refinedWhiteMaterial;
        } 
        else {
          child.material = whiteMaterial;
        }

        child.castShadow = true;
        child.receiveShadow = true;
        
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

      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-28, -0.45, 0]}>
          <boxGeometry args={[105, 35, 1]} /> 
          {/*<meshStandardMaterial color={'red'} />*/}
        </mesh>
      </RigidBody>    
    </>

    
  )
}

useGLTF.preload('/models/Maps/IntroMap/Level0.glb')
