import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useMemo } from 'react'

const FracturedModel = ({ position }) => {
  const { nodes } = useGLTF('/models/fractured.glb')

  // Use MeshPhysicalMaterial for clearcoat support
  const redCrystalMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    })
  }, [])

  return (
    <group position={position}>
      {Object.entries(nodes).map(([key, node], index) => {
        if (!node.geometry) return null // prevent undefined geometry crash

        const geometry = node.geometry.clone()

        // Add vertex colors with random red shades
        const colorArray = new Float32Array(geometry.attributes.position.count * 3)
        for (let i = 0; i < geometry.attributes.position.count; i++) {
          const redShade = 0.7 + Math.random() * 0.3
          colorArray.set([redShade, 0, 0], i * 3)
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

        return (
          <RigidBody
            key={index}
            colliders="hull"
            type="dynamic"
            gravityScale={1}
            enabledRotations={[true, true, true]}
          >
            <mesh
              geometry={geometry}
              material={redCrystalMaterial}
              castShadow
              receiveShadow
            />
          </RigidBody>
        )
      })}
    </group>
  )
}

export default FracturedModel
