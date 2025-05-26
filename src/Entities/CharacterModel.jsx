import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

const CharacterModel = ({
  modelPosition = [0, 0.1, 1.5], 
  modelRotation = [0, -Math.PI, 0], 
  modelScale = [0.25, 0.25, 0.25],
  showHead = true,
  showTorso = true,
  showLeftArm = true,
  showRightArm = true,
  showLeftLeg = true,
  showRightLeg = true,
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
  const baseModel = useGLTF('/models/Character/base-test.glb');

  // Load animations separately
  const idle = useGLTF('/models/Character/Anim/OrcIdle.glb');

  const jogForward = useGLTF('/models/Character/Anim/Jog.glb');

  const punch = useGLTF('/models/Character/Anim/PunchAtk.glb');
  const block = useGLTF('/models/Character/Anim/BoxingIdle.glb');

  const pistolIdle = useGLTF('/models/Character/Anim/Pistol Idle.glb');

  const sitTalk1 = useGLTF('/models/Character/Anim/Sitting Talking_1.glb');
  const sitTalk2 = useGLTF('/models/Character/Anim/Sitting Talking_2.glb');

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
      punch: mixer.clipAction(punch.animations[0]),
      block: mixer.clipAction(block.animations[0]),
      pistolIdle: mixer.clipAction(pistolIdle.animations[0]),
      sitTalk1: mixer.clipAction(sitTalk1.animations[0]),
      sitTalk2: mixer.clipAction(sitTalk2.animations[0]),
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
      if (child.isSkinnedMesh) {
        if(child.name === 'head'){
          child.visible = showHead;
        }
        if(child.name === 'leftarm'){
          child.visible = showLeftArm;
        }
        if(child.name === 'leftleg'){
          child.visible = showLeftLeg;
        }
        if(child.name === 'rightarm'){
          child.visible = showRightArm;
        }
        if(child.name === 'rightleg'){
          child.visible = showRightLeg;
        }
        if(child.name === 'torso'){
          child.visible = showTorso;
        }
      }
    })
  }, [clonedScene, showHead, showLeftArm, showLeftLeg, showRightArm, showRightLeg, showTorso])

  // Animation transition logic
  useEffect(() => {
    if (!actions || !mixerRef.current) return;

    const mixer = mixerRef.current;
    const newAction = actions[animationState];
    const prevAction = actions[currentAction];

    if (animationState !== currentAction && newAction) {
      prevAction?.fadeOut(0.1);
      newAction.reset();

      if (['idle', 'jogForward', 'sitTalk1', 'sitTalk2', ].includes(animationState)) {
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
  }, [animationState, actions, currentAction, isAttackingRef, nextInputQueueRef, setAnimationState]);

  // Update animation each frame
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

  const armBone = modelRef.current.getObjectByName("mixamorigLeftArm")
  if (armBone) {
    armBone.position.x = 10; 
  }
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
