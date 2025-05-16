import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useGameStore } from './useGameStore'

export default function Box() {
  const ref = useRef()
  const velocity = new THREE.Vector3()
  const speed = 5

  const scale = 0.4
  const width = 2.698 * scale   // ≈ 1.0792
  const height = 7.135 * scale  // ≈ 2.854
  const depth = 1.187 * scale   // ≈ 0.4748

  const keys = useRef({ w: false, a: false, s: false, d: false })

  useEffect(() => {
    useGameStore.getState().setPlayerRef(ref)

    const down = (e) => {
      if (keys.current[e.key.toLowerCase()] !== undefined) keys.current[e.key.toLowerCase()] = true
    }

    const up = (e) => {
      if (keys.current[e.key.toLowerCase()] !== undefined) keys.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return

    velocity.set(0, 0, 0)
    if (keys.current.w) velocity.z -= 1
    if (keys.current.s) velocity.z += 1
    if (keys.current.a) velocity.x -= 1
    if (keys.current.d) velocity.x += 1

    velocity.normalize().multiplyScalar(speed * delta)
    ref.current.position.add(velocity)
  })


  return (
    <mesh ref={ref} position={[0, 2.85/2, 0]}>
      <boxGeometry args={[1.1, 2.85, 0.48]} /> {/* Taller box (like human torso) */}
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
