import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

import { useKeyboardHandling } from "../../CustomHooks/useKeyboardHandling";
import { usePlayerStore } from "../../GlobalStateManager/usePlayerStore";

const MOVE_SPEED = 8;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = () => {
  const { camera } = useThree();

  const playerRef = useRef();
  const setPlayerRef = usePlayerStore(state => state.setPlayerRef);
  const [spawnPoint, setSpawnPoint] = useState([3, 3, 0]); 

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef);
    }
  }, [setPlayerRef]);

  const { forward, backward, left, right } = useKeyboardHandling();

  useFrame((state) => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction.subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyEuler(state.camera.rotation);

    playerRef.current.wakeUp();
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
  
    //Move camera
    const {x,y,z} = playerRef.current.translation();
    state.camera.position.set(x,y + 0.3,z);
  });

  return (
    <RigidBody
      ref={playerRef}
      position={spawnPoint}
      colliders={false}
      lockRotations
      name="Player"
    >
      <mesh>
        <CapsuleCollider args={[0.5, 0.5]} />
      </mesh>
    </RigidBody>
  );
};

export default Player;
