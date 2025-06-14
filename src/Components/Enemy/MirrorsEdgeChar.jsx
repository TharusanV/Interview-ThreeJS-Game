import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'

const MODEL_PATH = '/Char/faithModel.glb'
const ANIM_PATH = '/Animations/Wall Run.glb'

export function MirrorsEdgeChar({
  rotation = [0, degToRad(180), 0],
  position = [0, 0, -5],
  scale = 1, 
  ...props
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const { animations } = useGLTF(ANIM_PATH)

  const group = useRef()
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && Object.values(actions).length > 0) {
      const action = Object.values(actions)[0]
      //action.reset().play()
    }
  }, [actions])



  return (
    <primitive
      object={scene}
      ref={group}
      rotation={rotation}
      position={position}
      {...props}
    />
  )
}

useGLTF.preload(MODEL_PATH)
useGLTF.preload(ANIM_PATH)

