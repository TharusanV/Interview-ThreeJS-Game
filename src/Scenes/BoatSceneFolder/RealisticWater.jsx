import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Water } from 'three-stdlib'

export default function RealisticWater({width = 10, height = 10, speed = 1, waveHeight = 0.2, waveFrequency = 1.0, position = [0, 0, 0], }) {
  const waterRef = useRef()

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, 512, 512),
    [width, height]
  )

  const WATER_COLOR = '#FF0000' 

  useEffect(() => {
    if (!waterRef.current) return

    const water = waterRef.current
    water.material.uniforms.size.value = waveFrequency
    water.material.uniforms.distortionScale.value = waveHeight
  }, [waveFrequency, waveHeight])


  useFrame((_, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value += delta * speed
    }
  })

  return (
    <primitive
      object={new Water(geometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: new THREE.TextureLoader().load(
          'https://threejs.org/examples/textures/waternormals.jpg',
          (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          }
        ),
        sunDirection: new THREE.Vector3(0, 1, 0),
        sunColor: 0xffffff,
        waterColor: WATER_COLOR,
        distortionScale: waveHeight,
        fog: false,
      })}
      ref={waterRef}
      rotation-x={-Math.PI / 2}
      position={position} 
    />
  )
}
