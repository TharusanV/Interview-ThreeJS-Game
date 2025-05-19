import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'

// Paths
const MODEL_PATH = '/models/Character/char.glb'
const ANIM_PATHS = {
  idle: '/models/Anima/Orc Idle.glb',
  run: '/models/Anim/Jog.glb',
  attack: '/models/Anim/PunchAtk.glb',
}

const CharacterModel = ({ showHead = true, animation = 'idle', position = [0, 0, 0] }) => {
  const group = useRef()
  const mixer = useRef()
  const [actions, setActions] = useState({})
  const [currentAction, setCurrentAction] = useState(null)

  // Load base character model
  const base = useGLTF(MODEL_PATH)

  // Load animation clips from separate GLBs
  const animIdle = useGLTF(ANIM_PATHS.idle)
  const animRun = useGLTF(ANIM_PATHS.run)
  const animAttack = useGLTF(ANIM_PATHS.attack)

  // Clone so each instance has its own rig
  const cloned = useMemo(() => (base.scene ? clone(base.scene) : null), [base.scene])

  // Setup mixer & bind animations
  useEffect(() => {
    if (!cloned) return

    mixer.current = new THREE.AnimationMixer(cloned)

    const allClips = [
      ...animIdle.animations,
      ...animRun.animations,
      ...animAttack.animations,
    ]

    const newActions = {}
    allClips.forEach((clip) => {
      newActions[clip.name.toLowerCase()] = mixer.current.clipAction(clip)
    })

    setActions(newActions)

    return () => {
      mixer.current.stopAllAction()
    }
  }, [cloned, animIdle, animRun, animAttack])

  // Play animations with transition
  useEffect(() => {
    if (!mixer.current || !actions[animation]) return

    const newAction = actions[animation]
    const prevAction = actions[currentAction]

    if (prevAction && prevAction !== newAction) {
      prevAction.fadeOut(0.2)
    }

    newAction.reset().fadeIn(0.2).play()
    setCurrentAction(animation)
  }, [animation, actions, currentAction])

  // Animate
  useFrame((_, delta) => {
    mixer.current?.update(delta)
  })

  useEffect(() => {
    if (!cloned) return
    cloned.traverse((child) => {
      if (child.isSkinnedMesh && child.name === 'head') {
        child.visible = showHead
      }
    })
  }, [cloned, showHead])


  return cloned ? (
    <primitive
      object={cloned}
      ref={group}
      position={position}
      dispose={null}
    />
  ) : null
}

export default CharacterModel;