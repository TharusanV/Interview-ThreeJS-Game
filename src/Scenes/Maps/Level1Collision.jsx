import { useGLTF } from '@react-three/drei'
import { RigidBody, TrimeshCollider } from '@react-three/rapier'
import { useMemo } from 'react'
import * as THREE from 'three'

export const Level1Collision = (props) => {
  const { scene } = useGLTF('/level1Collision.glb')

  const colliders = useMemo(() => {
    const result = []

    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        child.updateWorldMatrix(true, false)

        // Clone and apply world transform
        const geom = child.geometry.clone()
        geom.applyMatrix4(child.matrixWorld)

        // Extract vertex positions
        const positionAttr = geom.getAttribute('position')
        if (!positionAttr) return

        const vertices = Array.from(positionAttr.array)

        // Extract indices (or generate them if geometry is non-indexed)
        let indices = []
        if (geom.index) {
          indices = Array.from(geom.index.array)
        } else {
          // Generate default indices
          indices = [...Array(positionAttr.count).keys()]
        }

        result.push(
          <TrimeshCollider
            key={child.uuid}
            args={[vertices, indices]}
          />
        )
      }
    })

    return result
  }, [scene])

  return (
    <RigidBody type="fixed" colliders={false} {...props}>
      {colliders}
    </RigidBody>
  )
}
