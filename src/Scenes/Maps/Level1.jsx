import React, { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshPhysicalMaterial, Color, } from 'three'

const xPosGround1 = -1;
const zPosGround1 = 26;
const xArgsGround1 = 6;
const zArgsGround1 = 32;

const xPosWall1 = 6.5;
const zPosWall1 = 26;
const xArgsWall1 = 2;
const zArgsWall1 = 32;

const xPosWall2 = -6;
const zPosWall2 = 26;
const xArgsWall2 = 2;
const zArgsWall2 = 32;

const xPosWall3 = -3;
const zPosWall3 = -4.5;
const xArgsWall3 = 5;
const zArgsWall3 = 4;


export default function Level1(props) {
  const { scene } = useGLTF('/levelblend.glb')

const customGlass = useMemo(() => {
  return new MeshPhysicalMaterial({
    color: new Color(0x88ccee),
    transmission: 1,
    roughness: 0,
    metalness: 0,
    thickness: 0,
    ior: 1.5,
    transparent: true,
    opacity: 1,
    reflectivity: 0,
    clearcoat: 0,
    clearcoatRoughness: 0,
    envMapIntensity: 0, 
  })
}, [])


  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material?.name === 'glassMaterial') {
        child.material = customGlass
      }
    })
  }, [scene, customGlass])

  return (
    <primitive object={scene} {...props} />
  )
}

useGLTF.preload('/levelblend.glb')



    {/*
          <RigidBody
      type="fixed"
      colliders={false}
      name="ground"
    >  
        
      <mesh position={[xPosGround1, -1.41, zPosGround1]}>   <boxGeometry args={[xArgsGround1 * 2, 1, zArgsGround1 * 2]} /> <meshStandardMaterial color={"red"} /> <Edges linewidth={4} scale={1} color="black" /> </mesh> 
      <CuboidCollider name='ground' args={[xArgsGround1, 1, zArgsGround1]} position={[xPosGround1, -2, zPosGround1]} />

      <mesh position={[xPosWall1, -1.41, zPosWall1]}>   <boxGeometry args={[xArgsWall1 * 2, 7 + 5.8, zArgsWall1 * 2]} /> <meshStandardMaterial color={"red"} /> <Edges linewidth={4} scale={1} color="black" /> </mesh>
      <CuboidCollider args={[xArgsWall1, 7, zArgsWall1]} position={[xPosWall1, -2, zPosWall1]} />

      <CuboidCollider args={[xArgsWall2, 7, zArgsWall2]} position={[xPosWall2, -2, zPosWall2]} />

      <CuboidCollider args={[xArgsWall3, 7, zArgsWall3]} position={[xPosWall3, -2, zPosWall3]} />  </RigidBody> */}