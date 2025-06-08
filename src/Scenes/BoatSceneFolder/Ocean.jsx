import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Vertex shader: Controls the wave movement
const vertexShader = `
  uniform float uTime;
  uniform float uWaveHeight;
  uniform float uWaveFrequency;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * uWaveFrequency + uTime) * uWaveHeight;
    pos.z += cos(pos.y * uWaveFrequency + uTime) * uWaveHeight;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Fragment shader: Controls the color
const fragmentShader = `
  varying vec2 vUv;

  void main() {
    vec3 color = mix(vec3(0.0, 0.3, 0.5), vec3(0.0, 0.5, 0.7), vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function Ocean({
  width = 10,
  height = 10,
  segments = 128,
  speed = 1,
  waveHeight = 0.2,
  waveFrequency = 1.5,
}) {
  const materialRef = useRef()

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * speed
    }
  })

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[width, height, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uWaveHeight: { value: waveHeight },
          uWaveFrequency: { value: waveFrequency },
        }}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
