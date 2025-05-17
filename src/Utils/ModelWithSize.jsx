import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function ModelWithSize({ url }) {
  const gltf = useGLTF(url)

  useEffect(() => {
    if (!gltf) return

    // Calculate bounding box of the model
    const box = new THREE.Box3().setFromObject(gltf.scene)

    // Get size (width, height, depth)
    const size = new THREE.Vector3()
    box.getSize(size)

    console.log('Model dimensions:', size.x, size.y, size.z)
  }, [gltf])

  return <primitive object={gltf.scene} />
}
