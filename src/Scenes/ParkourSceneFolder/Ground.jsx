import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function Ground() {
  const [roughness, normal] = useLoader(THREE.TextureLoader, [
    "textures/terrain-roughness.png",
  ]);

  // Set texture properties directly (safe since useLoader is synchronous)
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(5, 5);

  return (
    <mesh rotation-x={-Math.PI * 0.5} castShadow receiveShadow>
      <planeGeometry args={[30, 100]} />
      <meshStandardMaterial
        color="#222"
        roughness={1}
        metalness={0}
        normalMap={normal}
        normalScale={new THREE.Vector2(0.5, 0.5)}
      />
    </mesh>
  );
}
