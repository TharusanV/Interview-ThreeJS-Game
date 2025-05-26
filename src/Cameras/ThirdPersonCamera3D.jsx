import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from '../GlobalStateManager/usePlayerStore';

const ThirdPersonCamera3D = () => {
  const { camera, gl } = useThree();

  const player = usePlayerStore(state => state.playerRef);
  const playerAnimation = usePlayerStore(state => state.playerAnimation);

  const pointerLocked = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!pointerLocked.current) return;
    };

    const handlePointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('click', handleClick);
    };
  }, [gl.domElement]);

  useFrame((state) => {
    if(!player) return;
    
    const {x,y,z} = player.current.translation(); //Player position

    let offset = {x: 0, y: 0, z: 0};
    const blockOffset = {x: -0.1, y: 1.4, z: -0.1}
    const pistolOffset = {x: -0.07, y: 1.52, z: -0.1}
    const gunOffset = {x: -0.15, y: 1.55, z: -1.1}

    if(playerAnimation === "block"){
      if(camera.position.x != blockOffset.x || camera.position.y != blockOffset.y || camera.position.z != blockOffset.z){
        offset = blockOffset;
      }
    }
    else{
      offset = testOffset;
    }

    //Move camera
    camera.position.set(x + offset.x, y + offset.y, z + offset.z );

  });

  return null;
}

export default ThirdPersonCamera3D;