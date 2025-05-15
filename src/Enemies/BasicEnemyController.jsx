import BasicEnemy from './BasicEnemy';
import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from "three";

const BasicEnemyController = ({ position, playerRef }) => {
  const [animationState, setAnimationState] = useState('idle');

  const rb = useRef();
  const container = useRef();
  const basicEnemy = useRef();

  const isAttacking = useRef(false);
  const nextInputQueue = useRef([]);
  const punchToggle = useRef(true);

  // Vector3 to reuse to avoid allocations
  const playerPos = new Vector3();
  const enemyPos = new Vector3();
  const direction = new Vector3();

  useFrame(() => {
    if (!playerRef?.current || !basicEnemy.current) return;

    playerRef.current.getWorldPosition(playerPos);
    basicEnemy.current.getWorldPosition(enemyPos);

    direction.subVectors(playerPos, enemyPos);
    direction.y = 0;

    if (direction.lengthSq() > 0.0001) {
      direction.normalize();
      const angle = Math.atan2(direction.x, direction.z);

      // Add 180 degrees offset so model faces player correctly
      basicEnemy.current.rotation.y = angle + Math.PI;
    }
  });


  return (
    <RigidBody ref={rb} colliders={false} lockRotations>
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