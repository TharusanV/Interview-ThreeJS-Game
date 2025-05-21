import { useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../GlobalStateManager/useGameStore";
import CharacterModel from '../Entities/CharacterModel'
import * as THREE from "three";

import { Physics, RigidBody } from '@react-three/rapier'
import Player from '../Entities/Player/Player'
import { InterogrationRoom } from '../MapObj/InterogrationRoom'
import MouseLookController from '../Components/MouseLookController'


import {
  useHelper,
} from '@react-three/drei'

import { DirectionalLightHelper } from 'three'


const Lights = () => {
  const mainLight = useRef()

  useHelper(mainLight, DirectionalLightHelper, 1, 'hotpink')

  return (
    <>
      <ambientLight intensity={0.1} />

      <directionalLight
        ref={mainLight}
        position={[8, 5, 5]}
        intensity={0.5}
        castShadow
      />

      {mainLight.current && (
        <primitive object={mainLight.current.target} position={[0, 0, 0]} />
      )}

      <directionalLight position={[-5, -3, -10]} intensity={0.1} />
    </>
  )
}



const cinematicKeyframes = [
  { 
    cameraPos: new THREE.Vector3(0, 1 + 0.3, -0.6 - 0.3), 
    lookAt: new THREE.Vector3(0, 1.3, 0), 
    duration: 2000,
    lerpSpeed: 1.0
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.3, -0.9), 
    lookAt: new THREE.Vector3(-1, 1.3, 0), 
    duration: 3000,
    lerpSpeed: 1
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.3, -0.9), 
    lookAt: new THREE.Vector3(1, 1.3, 0), 
    duration: 3000,
    lerpSpeed: 2
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.3, -0.9), 
    lookAt: new THREE.Vector3(0, 1.3, 0), 
    duration: 3000,
    lerpSpeed: 2.5
  },
];

const Map1 = () => {
  const isCinematicPlaying = useGameStore(state => state.isCinematicPlaying);

  const { camera } = useThree();
  const [step, setStep] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const endCinematic = useGameStore(state => state.endCinematic);

  const targetLookAt = new THREE.Vector3();
  const direction = new THREE.Vector3();

  useFrame(({ clock }) => {
    if (step >= cinematicKeyframes.length) {
      endCinematic();
      return;
    }

    const current = cinematicKeyframes[step];
    const lerpSpeed = current.lerpSpeed ?? 1;

    if (startTime === null) {
      setStartTime(clock.elapsedTime);
    }

    const elapsed = (clock.elapsedTime - startTime) * 1000;
    const tRaw = Math.min(elapsed / current.duration, 1);

    // Apply speed multiplier to t
    const t = lerpSpeed === 0 ? 1 : Math.min(tRaw * lerpSpeed, 1);

    const prev = cinematicKeyframes[step - 1] || {
      cameraPos: camera.position.clone(),
      lookAt: camera.position.clone().add(direction)
    };

    // Smooth or instant movement
    if (lerpSpeed === 0) {
      camera.position.copy(current.cameraPos);
      camera.lookAt(current.lookAt);
    } 
    else {
      camera.position.lerpVectors(prev.cameraPos, current.cameraPos, t);
      targetLookAt.lerpVectors(prev.lookAt, current.lookAt, t);
      camera.lookAt(targetLookAt);
    }

    if (t >= 1) {
      setStep(s => s + 1);
      setStartTime(clock.elapsedTime);
    }
  });

  return (
    <>
      {!isCinematicPlaying && <MouseLookController/>}

      <Lights />
                
      <Physics gravity={[0, -9.81, 0]} debug>
        
        <InterogrationRoom />

        <CharacterModel />
        
        <Player />
      </Physics>
    </>
  );
};

export default Map1;
