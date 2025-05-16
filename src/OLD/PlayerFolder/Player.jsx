import LoadEntityModel from '../Components/LoadEntityModel'; 
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
const FRAME_RATE = 30; // Mixamo default

const Player = ({
  isAttackingRef,
  nextInputQueueRef,
  animationState,
  setAnimationState
}) => {

  const modelRef = useRef();
  const mixerRef = useRef();

  const [actions, setActions] = useState({});
  const [currentAction, setCurrentAction] = useState(null);

  const modelPosition = [-0.5, 0, 0];
  const modelRotation = [0, -Math.PI, 0];
  const modelScale = [0.4, 0.35, 0.4];

  const baseModel = useGLTF('/models/base.glb');
  const idle = useGLTF('/models/Orc Idle.glb');
  const block = useGLTF('/models/BoxingIdle_Animation.glb');
  const elbowAtk = useGLTF('/models/ElbowAtk_Animation.glb');
  const punchAtk = useGLTF('/models/PunchAtk_Animation.glb');
  const hookAtk = useGLTF('/models/HookAtk_Animation.glb');
  const roundHouseAtk = useGLTF('/models/RoundhouseAtk_Animation.glb');

  const jogForward = useGLTF('/models/Jog Forward.glb');
  const jogBackward = useGLTF('/models/Jog Backward.glb');
  const jogLeft = useGLTF('/models/Jog Left.glb');
  const jogRight = useGLTF('/models/Jog Right.glb');

  const jogNE = useGLTF('/models/JogNE.glb');
  const jogNW = useGLTF('/models/JogNW.glb');
  const jogSE = useGLTF('/models/JogSE.glb');
  const jogSW = useGLTF('/models/JogSW.glb');

  // Clone the model so each entity has its own scene graph
  const clonedScene = useMemo(() => {
    return baseModel?.scene ? clone(baseModel.scene) : null;
  }, [baseModel.scene]);

  // Setup mixer and actions
  useEffect(() => {
    if (!clonedScene) return;

    const mixer = new THREE.AnimationMixer(clonedScene); // Use cloned scene
    mixerRef.current = mixer;

    // Map of animation actions
    const animActions = {
      idle: mixer.clipAction(idle.animations[0]),
      block: mixer.clipAction(block.animations[0]),
      elbow: mixer.clipAction(elbowAtk.animations[0]),
      punch_1: mixer.clipAction(punchAtk.animations[0]),
      punch_2: mixer.clipAction(punchAtk.animations[0]),
      hook: mixer.clipAction(hookAtk.animations[0]),
      roundHouseKick: mixer.clipAction(roundHouseAtk.animations[0]),

      jogForward: mixer.clipAction(jogForward.animations[0]),
      jogBackward: mixer.clipAction(jogBackward.animations[0]),
      jogLeft: mixer.clipAction(jogLeft.animations[0]),
      jogRight: mixer.clipAction(jogRight.animations[0]),
      jogNE: mixer.clipAction(jogNE.animations[0]),
      jogNW: mixer.clipAction(jogNW.animations[0]),
      jogSE: mixer.clipAction(jogSE.animations[0]),
      jogSW: mixer.clipAction(jogSW.animations[0]),
    };

    // Increase punch speed
    animActions.punch_1.setEffectiveTimeScale(1.5);
    animActions.hook.setEffectiveTimeScale(1.5);

    setActions(animActions);

    return () => {
      mixer.stopAllAction();
    };
  // Only rerun if baseModel or animationClips *actually* change
  }, [clonedScene]);

  // Material override
  useEffect(() => {
  if (!clonedScene) return;
    clonedScene.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#d83333'),
          roughness: 0.21,
          metalness: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
        });
      }
    });
  }, [clonedScene]);

  
  // Shadows
  useEffect(() => {
    if (!clonedScene) return;
    baseModel.scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }
    });
  }, [baseModel]);

  // Handle animation transitions
  useEffect(() => {
    if (!actions || !mixerRef.current) return;

    const mixer = mixerRef.current;
    const newAction = actions[animationState];
    const prevAction = actions[currentAction];

    if (animationState !== currentAction && newAction) {
      prevAction?.fadeOut(0.1);

      newAction.reset();

      //console.log(animationState);

      if (['idle', 'block', 'jogForward', 'jogBackward', 'jogLeft', 'jogRight', 'jogNE', 'jogNW', 'jogSE', 'jogSW'].includes(animationState)) {
        newAction.setLoop(THREE.LoopRepeat);
        newAction.clampWhenFinished = false;
      } 
      else {
        newAction.setLoop(THREE.LoopOnce, 1);
        newAction.clampWhenFinished = true;

        const onFinish = () => {
          mixer.removeEventListener('finished', onFinish);

          if (nextInputQueueRef?.current?.length > 0) {
            setAnimationState(nextInputQueueRef.current.shift());
          } 
          else {
            isAttackingRef.current = false;
            setAnimationState('idle');
          }
        };

        mixer.addEventListener('finished', onFinish);
      }

      newAction.fadeIn(0.1).play();
      setCurrentAction(animationState);
    }
  }, [animationState, actions, currentAction,]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    const action = actions[currentAction];
    if (!action || !action.isRunning()) return;
  });

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      position={modelPosition}
      rotation={modelRotation}
      scale={modelScale}
    />

  );
}

export default Player;
