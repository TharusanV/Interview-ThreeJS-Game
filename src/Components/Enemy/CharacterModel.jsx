import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import { degToRad } from 'three/src/math/MathUtils.js';

const CharacterModel = ({
  name,
  modelPosition = [0, 0, 0], 
  modelRotation = [degToRad(90), degToRad(0), 0], 
  modelScale = [1, 1, 1],
  
  isAttackingRef,
  nextInputQueueRef,
  animationState = 'idle',
  setAnimationState,
}) => {
  const modelRef = useRef();
  const mixerRef = useRef();

  const [actions, setActions] = useState({});
  const [currentAction, setCurrentAction] = useState(null);


  // Load model (no animations)
  const baseModel = useGLTF(`/Char/${name}.glb`);

  // Load animations separately
  const idle = useGLTF('/Animations/Idle.glb');
  const forward = useGLTF('/Animations/Running.glb');

  // Clone the model (deep clone of skinned mesh and skeleton)
  const clonedScene = useMemo(() => {
    return baseModel?.scene ? clone(baseModel.scene) : null;
  }, [baseModel.scene]);

  // Setup mixer and actions
  useEffect(() => {
    if (!clonedScene) return;

    const mixer = new THREE.AnimationMixer(clonedScene);
    mixerRef.current = mixer;

    const animActions = {
      idle: mixer.clipAction(idle.animations[0]),
      forward: mixer.clipAction(forward.animations[0]),
    };

    // Set custom playback speed
    //animActions.forward.setEffectiveTimeScale(0.6);

    setActions(animActions);

    return () => {
      mixer.stopAllAction();
    };
  }, [clonedScene, idle]);  
  
  // Animation transition logic
  useEffect(() => {
    if (!actions || !mixerRef.current) return;

    const mixer = mixerRef.current;
    const newAction = actions[animationState];
    const prevAction = actions[currentAction];

    if (animationState !== currentAction && newAction) {
      prevAction?.fadeOut(0.1);
      newAction.reset();

      if (['idle', 'forward'].includes(animationState)) {
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
  }, [animationState, actions, currentAction, nextInputQueueRef, setAnimationState]);



  // Update animation each frame
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  return clonedScene ? (
    <primitive
      ref={modelRef}
      object={clonedScene}
      position={modelPosition}
      rotation={modelRotation}
      scale={modelScale}
    />
  ) : null;
};

export default CharacterModel
