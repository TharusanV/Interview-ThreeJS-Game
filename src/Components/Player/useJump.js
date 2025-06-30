//Jump on box and using it as leverage to jump higher - Hold Jump (Check distance ahead for a box)

//Normal Jump - Jump (Jump on ledge)

//Can hold jump and if a wall is after the block then use the box for leverage and wall run


import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

const JUMP_FORCE = 5;
const BOX_JUMP_FORCE = JUMP_FORCE * 2;

export const useStandardJump = (playerRef) => {
    if (!playerRef.current) return;
    playerRef.current.applyImpulse({ x: 0, y: 6, z: 0 }, true);
}

export const useBoxJump = (playerRef) => {
    playerRef.current.applyImpulse({ x: 0, y: BOX_JUMP_FORCE, z: 0 }); 
}