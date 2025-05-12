import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Player({ animationState}) {
  const modelRef = useRef();
  const mixerRef = useRef();

  // Load base model and animations separately
  const base = useGLTF('/models/base.glb');
  const idle = useGLTF('/models/Idle_Animation.glb');

  const [actions, setActions] = useState({});
  const [currentAction, setCurrentAction] = useState(null);

  useEffect(() => {
    if (!base || !idle) return;

    // Create mixer on model
    const model = base.scene;
    const mixer = new THREE.AnimationMixer(model);
    mixerRef.current = mixer;

    // Map of animation actions
    const animActions = {
      idle: mixer.clipAction(idle.animations[0]),
    };

    setActions(animActions);

    // Play default idle animation
    animActions.idle.play();
    setCurrentAction('idle');

    return () => {
      mixer.stopAllAction();
    };
  }, [base, idle]);

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
