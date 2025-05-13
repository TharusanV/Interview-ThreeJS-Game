import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import Player from './Player';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from "leva";
import { Vector3, MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const WALK_SPEED = 0.8;
const RUN_SPEED = 1.6;
const ROTATION_SPEED = degToRad(0.5);

const PlayerController = ({animationState, setAnimationState}) => {
  
  const rb = useRef();
  const container = useRef();
  const player = useRef();

  const playerRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  const [, get] = useKeyboardControls();
  
  useFrame(({camera}) => {
    //Movement
    if(rb.current){
      const vel = rb.current.linvel();

      const movement = {x: 0, z: 0};

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().forward) {movement.z = -1;}
      if (get().backward) {movement.z = 1;}
      if (get().left) {movement.x = -1;}
      if (get().right) {movement.x = 1;}

      if (movement.x !== 0 || movement.z !== 0) { //
        vel.z = speed * movement.z;
        vel.x = speed * movement.x;
      }

      rb.current.setLinvel(vel, true);
    } 

    // CAMERA Movement
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);
  
    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });
  
  return (
    <RigidBody ref={rb} colliders={false} lockRotations>
      <group ref={container}>
        <group ref={cameraTarget} position={[0.2, 1, -3]}/>
        <group ref={cameraPosition} position={[0.2, 2, 1.2]}/>
        <group ref={player}>
           <Player animationState={animationState} setAnimationState={setAnimationState}/>
        </group>
      </group>
      
      <CapsuleCollider args={[0.7, 0.3]} position={[0, 1, 0]} />
    </RigidBody>
    
  )
}

export default PlayerController