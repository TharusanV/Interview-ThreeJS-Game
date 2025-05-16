import BasicEnemy from './BasicEnemy';
import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from "three";
import { useZustandStore } from '../Components/useZustandStore';

const BasicEnemyController = ({ position }) => {
  const playerRef = useZustandStore((state) => state.playerRef);

  const [animationState, setAnimationState] = useState('idle');

  const canMoveRef = useRef(false);   
  const canRotateRef = useRef(true);    

  const rb = useRef();
  const container = useRef();
  const basicEnemy = useRef();

  const isAttacking = useRef(false);
  const nextInputQueue = useRef([]);
  const punchToggle = useRef(true);

  const SPEED = 1.5;
  const MIN_DISTANCE = 1.5; // stop moving when within this range
  const ROTATION_SMOOTHNESS = 0.1;
  const MOVE_DELAY = 1000; // ms buffer before enemy starts moving

  // Vector3 to reuse to avoid allocations
  const playerPos = new Vector3();
  const enemyPos = new Vector3();
  const direction = new Vector3();

  // Delay before movement begins (buffer to let it settle)
  useEffect(() => {
    const timeout = setTimeout(() => {
      canMoveRef.current = true;
    }, MOVE_DELAY);

    return () => clearTimeout(timeout);
  }, []);

  useFrame(() => {
    if (!playerRef?.current || !basicEnemy.current)  return;

    playerRef.current.getWorldPosition(playerPos); // Get player world position
    basicEnemy.current.getWorldPosition(enemyPos); // Get enemy world position

    direction.subVectors(playerPos, enemyPos); // Calculate direction from enemy to player on XZ plane only (ignore Y)
    direction.y = 0;

    const distance = direction.length();

    // LOGIC FOR ROTATION
    if (canRotateRef.current && distance > 0.1) {
      direction.normalize();

      // Calculate angle to rotate enemy to face player - Assuming enemy looks down negative Z axis by default 
      const angle = Math.atan2(direction.x, direction.z);

      // Set enemy rotation.y to angle so it faces player
      basicEnemy.current.rotation.y = angle;

      // Add 180 degrees offset so model faces player correctly
      basicEnemy.current.rotation.y += Math.PI;
    }

    // LOGIC FOR MOVEMENT
    if(canMoveRef.current){
      if(distance > MIN_DISTANCE){
        const velocity = direction.clone().multiplyScalar(SPEED);

        rb.current.setLinvel({ x: velocity.x, y: 0, z: velocity.z }, true);

        if (animationState !== 'jogForward') {
          setAnimationState('jogForward');
        }
      }
      else {
        rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      
        if (animationState !== 'idle') {setAnimationState('idle');}
      }
    }

    //LOGIC FOR ATTACK
    if(distance > MIN_DISTANCE){
      
    }

  });


  return (
    <RigidBody ref={rb} colliders={false} lockRotations name="Enemy">
      <group ref={container}>
        <group ref={basicEnemy} position={position}>
          <BasicEnemy
            isAttackingRef={isAttacking}
            nextInputQueueRef={nextInputQueue}
            animationState={animationState}
            setAnimationState={setAnimationState}
          />
        </group>
      </group>
      <CapsuleCollider
        args={[0.7, 0.3]}
        position={[position[0], position[1] + 1, position[2]]}
      />


    </RigidBody>
  );
};

export default BasicEnemyController;