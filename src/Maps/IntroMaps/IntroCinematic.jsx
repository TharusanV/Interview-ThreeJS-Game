import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../GlobalStateManager/useGameStore";

const cinematicKeyframes = [

];

const IntroCinematic = () => {
  const { camera } = useThree();
  
  const [step, setStep] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const endCinematic = useGameStore(state => state.endCinematic);

  const targetLookAt = new THREE.Vector3();
  const direction = new THREE.Vector3();

  useFrame(({ clock }) => {
    if (step >= cinematicKeyframes.length) {
      //console.log(2);
      endCinematic();
      return;
    }

    const cinematicKeyframe = cinematicKeyframes[step];
    const lerpSpeed = cinematicKeyframe.lerpSpeed ?? 1;

    if (startTime === null) {
      setStartTime(clock.elapsedTime);
    }

    const elapsed = (clock.elapsedTime - startTime) * 1000;
    const tRaw = Math.min(elapsed / cinematicKeyframe.duration, 1);

    // Apply speed multiplier to t
    const t = lerpSpeed === 0 ? 1 : Math.min(tRaw * lerpSpeed, 1);

    const prev = cinematicKeyframes[step - 1] || {
      cameraPos: camera.position.clone(),
      lookAt: camera.position.clone().add(direction)
    };

    // Smooth or instant movement
    if (lerpSpeed === 0) {
      camera.position.copy(cinematicKeyframe.cameraPos);
      camera.lookAt(cinematicKeyframe.lookAt);
    } 
    else {
      camera.position.lerpVectors(prev.cameraPos, cinematicKeyframe.cameraPos, t);
      targetLookAt.lerpVectors(prev.lookAt, cinematicKeyframe.lookAt, t);
      camera.lookAt(targetLookAt);
    }

    if (t >= 1) {
      //console.log("test");
      setStep(s => s + 1);
      setStartTime(clock.elapsedTime);
    }
  });

  return null;
}

export default IntroCinematic