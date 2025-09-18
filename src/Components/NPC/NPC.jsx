import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";


const NPC = ({
  
  fileModelName = "C",
  modelScale = [1,1,1],
  animationState = 'idle',
  
  moveSpeed = 20,
  spawnPoint = [0, 0, 0],
}) => {


  

  return (
    <div>Sti</div>
  )
}

export default NPC