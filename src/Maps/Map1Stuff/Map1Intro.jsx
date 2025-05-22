import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../GlobalStateManager/useGameStore";

const cinematicKeyframes = [
  { 
    cameraPos: new THREE.Vector3(0, 1 + 0.4, -0.6 - 0.3), 
    lookAt: new THREE.Vector3(0, 1.4, 0), 
    duration: 2000,
    lerpSpeed: 1.0
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.4, -0.9), 
    lookAt: new THREE.Vector3(-1, 1.4, 0), 
    duration: 3000,
    lerpSpeed: 1
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.4, -0.9), 
    lookAt: new THREE.Vector3(1, 1.4, 0), 
    duration: 3000,
    lerpSpeed: 2
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.4, -0.9), 
    lookAt: new THREE.Vector3(0, 1.4, 0), 
    duration: 3000,
    lerpSpeed: 2.5
  },
  { 
    cameraPos: new THREE.Vector3(0, 1.4, -0.9), 
    lookAt: new THREE.Vector3(0, 1.4, 0), 
    duration: 3000,
    lerpSpeed: 2.5
  },
];

const Map1Intro = () => {

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

  return null;
}

export default Map1Intro