//Jump on box and using it as leverage to jump higher - Hold Jump (Check distance ahead for a box)

//Normal Jump - Jump (Jump on ledge)

//Can hold jump and if a wall is after the block then use the box for leverage and wall run


import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

const JUMP_FORCE = 5;

export const useStandardJump = (playerRef, isGroundedRef, isJumpingRef) => {
    if (!isGroundedRef.current || isJumpingRef.current) return;

    // Apply physics jump
    playerRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 });
}

export const useBoxJump = () => {
  
}