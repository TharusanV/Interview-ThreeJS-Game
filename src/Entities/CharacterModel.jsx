import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

// Config
const modelPosition = [0, 0.1, 1.5];
const modelRotation = [0, -Math.PI, 0];
const modelScale = [0.25, 0.25, 0.25];

const CharacterModel = ({}) => {
  const modelRef = useRef();
  const mixerRef = useRef();

  const isAttackingRef = useRef(false);
  const nextInputQueueRef = useRef([]); 
  const [animationState, setAnimationState] = useState('idle');
  const [showHead, setShowHead] = useState(true);

  const [actions, setActions] = useState({});
  const [currentAction, setCurrentAction] = useState(null);

  // Load model (no animations)
  const baseModel = useGLTF('/models/Character/char.glb');

  // Load animations separately
  const idle = useGLTF('/models/Character/Anim/OrcIdle.glb');
  const jogForward = useGLTF('/models/Character/Anim/Jog.glb');

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
      jogForward: mixer.clipAction(jogForward.animations[0]),
    };

    setActions(animActions);

    return () => {
      mixer.stopAllAction();
    };
  }, [clonedScene, idle, jogForward]);

  // Override materials
  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#d83333'),
          roughness: 0.5,
          metalness: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
        });
      }
    });
  }, [clonedScene]);

  //Hide part
  useEffect(() => {
    if (!clonedScene) return
    clonedScene.traverse((child) => {
      if (child.isSkinnedMesh && child.name === 'head') {
        child.visible = showHead
      }
    })
  }, [clonedScene, showHead])

  // Animation transition logic
  useEffect(() => {
    if (!actions || !mixerRef.current) return;

    const mixer = mixerRef.current;
    const newAction = actions[animationState];
    const prevAction = actions[currentAction];

    if (animationState !== currentAction && newAction) {
      prevAction?.fadeOut(0.1);
      newAction.reset();

      if (['idle', 'jogForward',].includes(animationState)) {
        newAction.setLoop(THREE.LoopRepeat);
        newAction.clampWhenFinished = false;
      } else {
        newAction.setLoop(THREE.LoopOnce, 1);
        newAction.clampWhenFinished = true;

        const onFinish = () => {
          mixer.removeEventListener('finished', onFinish);
          if (nextInputQueueRef?.current?.length > 0) {
            setAnimationState(nextInputQueueRef.current.shift());
          } else {
            isAttackingRef.current = false;
            setAnimationState('idle');
          }
        };

        mixer.addEventListener('finished', onFinish);
      }

      newAction.fadeIn(0.1).play();
      setCurrentAction(animationState);
    }
  }, [animationState, actions, currentAction, isAttackingRef, nextInputQueueRef, setAnimationState]);

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
