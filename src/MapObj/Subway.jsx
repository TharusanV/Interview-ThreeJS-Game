import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const superhotWhiteMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.8,
  metalness: 0,
  emissive: '#111111',
  emissiveIntensity: 0.1,
})

export function Subway(props) {
  const { nodes, materials } = useGLTF('/models/Subway/scene.gltf')

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Sleepsack */}
        <mesh castShadow receiveShadow geometry={nodes.Object_2.geometry} material={superhotWhiteMaterial} />
        
        {/* 3rd_rail */}
        <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={superhotWhiteMaterial} />
        {/* Material */}
        <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={superhotWhiteMaterial} />
        {/* SIGNS */}
        <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={superhotWhiteMaterial} />
        {/* Ticket */}
        <mesh castShadow receiveShadow geometry={nodes.Object_7.geometry} material={superhotWhiteMaterial} />
        {/* Trashcanbreak */}
        <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={superhotWhiteMaterial} />
        {/* base */}
        <mesh castShadow receiveShadow geometry={nodes.Object_9.geometry} material={superhotWhiteMaterial} />
        {/* bench */}
        <mesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={superhotWhiteMaterial} />
        {/* checker */}
        <mesh castShadow receiveShadow geometry={nodes.Object_11.geometry} material={superhotWhiteMaterial} />
        {/* checker.001 */}
        <mesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={superhotWhiteMaterial} />
        {/* checker.002 */}
        <mesh castShadow receiveShadow geometry={nodes.Object_13.geometry} material={superhotWhiteMaterial} />
        {/* checker.003 */}
        <mesh castShadow receiveShadow geometry={nodes.Object_14.geometry} material={superhotWhiteMaterial} />
        {/* lights */}
        <mesh castShadow receiveShadow geometry={nodes.Object_15.geometry} material={superhotWhiteMaterial} />
        {/* pillars */}
        <mesh castShadow receiveShadow geometry={nodes.Object_16.geometry} material={superhotWhiteMaterial} />
        {/* rail */}
        <mesh castShadow receiveShadow geometry={nodes.Object_17.geometry} material={superhotWhiteMaterial} />
        {/* vendingmachine */}
        <mesh castShadow receiveShadow geometry={nodes.Object_18.geometry} material={superhotWhiteMaterial} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/Subway/scene.gltf')
