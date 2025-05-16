import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3, Euler } from 'three'
import { useGameStore } from './useGameStore'

export default function CameraRig() {
  const { camera } = useThree() //Grabs the active camera from the Three.js context (managed by fiber)

  const offset = new Vector3()
  const targetLook = new Vector3()

  const cameraMode = useGameStore((s) => s.cameraMode)
  const playerRef = useGameStore((s) => s.playerRef)

  useFrame(() => {
    if (!playerRef?.current) return

    const target = playerRef.current.position

    // Offset camera mode
    switch (cameraMode) {
      case 'combat':
        offset.set(0, 4, 8)
        break
      case 'default':
      default:
        offset.set(2, 2, 4.5)
        break
    }


    const desiredPosition = new Vector3().addVectors(target, offset)

    camera.position.lerp(desiredPosition, 0.1)

    targetLook.lerp(target.clone().add(new Vector3(2, 3, 0)), 0.1)
    camera.lookAt(targetLook)
  })

  return null;
}
