import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useKeyboardHandling } from "../../CustomHooks/useKeyboardHandling";
import * as THREE from "three";
import PlayerLoadModel from "./PlayerLoadModel";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();


const Player = () => {
  const rb = useRef();
  const container = useRef();
  const playerRef = useRef();

  const {forward, backward, left, right, shift} = useKeyboardHandling();
  const [animationState, setAnimationState] = useState('idle');

  useFrame((state) => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel(); //Get the current linear velocity of the player.

    frontVector.set(0, 0, backward - forward); //Set the forward/backward motion vector based on the pressed buttons.
    sideVector.set(left - right, 0, 0); //Set the left/right movement vector.

    //Calculate the final vector of player movement by subtracting the movement vectors, normalising the result (so that the vector length is 1) and multiplying by the movement speed constant.
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED);

    //"Wakes up" the player object to make sure it reacts to changes. If you don't use this method, after some time the object will "sleep" and will not react to position changes.
    playerRef.current.wakeUp();

    //Set the player's new linear velocity based on the calculated direction of movement and keep the current vertical velocity (so as not to affect jumps or falls).
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
  });

  return (
    <>
      <RigidBody ref={playerRef} colliders={false} lockRotations name="Player">
          <PlayerLoadModel/>

          <CapsuleCollider 
            args={[1, 0.3]} 
            position={[0, 2.3, 0]} 
          />
      </RigidBody>
    </>
  )
}

export default Player