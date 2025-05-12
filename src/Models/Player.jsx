import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FRAME_RATE = 30; // Mixamo default

function Player({ animationState}) {
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
    };

    setActions(animActions);

    // Play default idle animation on start
    animActions.idle.play();
    setCurrentAction('idle');

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

    if (animationState !== currentAction && actions[animationState]) {
      actions[currentAction]?.fadeOut(0.2);
      
      actions[animationState]?.reset().fadeIn(0.2).play();

      setCurrentAction(animationState);
    }
  }, [animationState, actions, currentAction]);


  // Update animation frame
  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    const action = actions[currentAction];
    if (!action || !action.isRunning()) return;

    if(currentAction == "block"){

    }
    else if(currentAction == "punch"){

    }
    else if(currentAction == "hook"){

    }
    else if(currentAction == "elbow"){

    }
    else if(currentAction == "roundHouseKick"){

    }
    else{ //Default is Idle

    }
  });

  return (
    <primitive
      ref={modelRef}
      object={base.scene}
      position={[0, -1, 0]}
      scale={[0.3, 0.3, 0.3]}
    />
  );
}

export default Player;
