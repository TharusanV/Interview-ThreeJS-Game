import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FRAME_RATE = 30; // Mixamo default

function Player({ isAttackingRef, nextInputRef, animationState, setAnimationState}) {
  const modelRef = useRef();
  const mixerRef = useRef();

  // Load base model and animations separately
  const base = useGLTF('/models/base.glb');
  const idle = useGLTF('/models/Idle_Animation.glb');
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

  const [actions, setActions] = useState({});
  const [currentAction, setCurrentAction] = useState(null);

  //Set-up
  useEffect(() => {
    if (!base || !idle) return;

    // Create mixer on model
    const model = base.scene;
    const mixer = new THREE.AnimationMixer(model);
    mixerRef.current = mixer;

    // Map of animation actions
    const animActions = {
      idle: mixer.clipAction(idle.animations[0]),
      block: mixer.clipAction(block.animations[0]),
      elbow: mixer.clipAction(elbowAtk.animations[0]),
      punch: mixer.clipAction(punchAtk.animations[0]),
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

    setActions(animActions);

    return () => {
      mixer.stopAllAction();
    };
  }, [base, idle, block, elbowAtk, punchAtk, hookAtk]);

  //Shadows
  useEffect(() => {
  base.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false; // optional: prevents invisible-on-camera culling
    }
  });
  }, [base]);

  
  // Handle animation switching
  useEffect(() => {
    if (!actions || !mixerRef.current) return;

    const mixer = mixerRef.current;
    const newAction = actions[animationState];
    const prevAction = actions[currentAction];

    if (animationState !== currentAction && newAction) {
      prevAction?.fadeOut(0.2);
      newAction.reset();

      //Animation speed
      if (animationState === 'punch' || animationState === 'hook') {
        newAction.timeScale = 1.2; 
      } else {
        newAction.timeScale = 1.0; // normal speed
      }

      // Loop logic
      if (
        animationState === 'idle' || animationState === 'block' ||
        animationState === 'jogForward' || animationState === 'jogBackward' || animationState === 'jogLeft' || animationState === 'jogRight' ||
        animationState === 'jogNE' || animationState === 'jogNW' || animationState === 'jogSE' || animationState === 'jogSW'
      ) {
        newAction.setLoop(THREE.LoopRepeat);
        newAction.clampWhenFinished = false;
      } 
      else {
        newAction.setLoop(THREE.LoopOnce, 1);
        newAction.clampWhenFinished = true;

        const onFinish = () => {
          console.log("Action finished");

          isAttackingRef.current = false;
          
          if (nextInputRef.current) {
            const queued = nextInputRef.current;
            nextInputRef.current = null;
          } 
          else {
            setAnimationState('idle');
          }

          mixer.removeEventListener('finished', onFinish);
        };

        mixer.addEventListener('finished', onFinish);
      }

      newAction.fadeIn(0.2).play();
      setCurrentAction(animationState);
    }
  }, [animationState, actions, currentAction]);




  // Update animation frame
  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    const action = actions[currentAction];
    if (!action || !action.isRunning()) return;

  });

  return (
    <primitive
      ref={modelRef}
      object={base.scene}
      position={[0, 0, 0]}
      rotation={[0, -Math.PI, 0]}
      scale={[0.3, 0.3, 0.3]}
    />
  );
}

export default Player;
