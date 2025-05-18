import React from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function InterogationRoom({ rotation = [0, 0, 0], position = [0, 0, 0], scale = 1, ...props }) {
  const { nodes } = useGLTF('/models/Rooms/untitled.gltf')

  // Single plain white material
  const plainMaterial = new THREE.MeshStandardMaterial({ color: 'white' })


  return (
    <group rotation={rotation} position={position} scale={scale} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Walls.geometry}
        material={plainMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table.geometry}
        material={plainMaterial}
        position={[0.015, 0.777, 0.032]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Chair.geometry}
        material={plainMaterial}
        position={[-0.135, 0, 0.58]}
        rotation={[Math.PI / 2, 0, 1.846]}
        scale={0.004}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Chair001.geometry}
        material={plainMaterial}
        position={[0.044, 0, -0.451]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={0.004}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Watch.geometry}
        material={plainMaterial}
        position={[-1.579, 1.927, 1.836]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Door.geometry}
        material={plainMaterial}
        position={[0.406, 0, 3.032]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Window.geometry}
        material={plainMaterial}
        position={[1.547, 1.678, 0.795]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Switch.geometry}
        material={plainMaterial}
        position={[-0.352, 1.206, 2.955]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.001}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Neon_Tubes.geometry}
        material={plainMaterial}
        position={[0.62, 2.702, 0.997]}
        rotation={[-Math.PI, -1.571, 0]}
        scale={0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Neon_Tubes001.geometry}
        material={plainMaterial}
        position={[0.62, 2.702, -0.858]}
        rotation={[-Math.PI, -1.571, 0]}
        scale={0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Surveillance_Camera.geometry}
        material={plainMaterial}
        position={[-0.069, 2.351, 2.731]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.002}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Papers.geometry}
        material={plainMaterial}
        position={[-0.019, 0.812, 0.199]}
        rotation={[Math.PI / 2, 0, -0.702]}
        scale={0.001}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Handcuffs.geometry}
        material={plainMaterial}
        position={[0.341, 0.814, -0.074]}
        rotation={[Math.PI / 2, 0, -2.499]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Background.geometry}
        material={plainMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
    </group>
  )
}

useGLTF.preload('/models/Rooms/untitled.gltf')
