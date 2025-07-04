import React from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useZiplineManager } from "../../GlobalStateManager/useZiplineManager";

const Ziplines = () => {
  const pillars = useZiplineManager((state) => state.ziplinePillars);

  const ziplines = [];

  const thickness = 0.05;

  for (let i = 0; i < pillars.length - 1; i += 2) {
    const start = pillars[i];
    const end = pillars[i + 1];

    const halfHeightPillar1 = start.dimensions[1] / 2;
    const halfHeightPillar2 = end.dimensions[1] / 2

    // Compute values for cylinder positioning & rotation
    const startVec = new THREE.Vector3(
      start.pos[0],
      start.pos[1] + start.dimensions[1],
      start.pos[2]
    );

    const endVec = new THREE.Vector3(
      end.pos[0],
      end.pos[1] + end.dimensions[1],
      end.pos[2]
    );

    
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    
    // Cylinder default direction is along Y axis, rotate to align with zipline direction
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());

    ziplines.push(
      <group key={`zipline-${i}`}>
        {/* Start Pillar */}
        <RigidBody
          name={start.name}
          type="fixed"
          colliders="cuboid"
          userData={{ start: start.start, end: end.start }}
        >
          <mesh
            position={[
              start.pos[0],
              start.pos[1] + halfHeightPillar1,
              start.pos[2],
            ]}
          >
            <boxGeometry args={start.dimensions} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        {/* End Pillar */}
        <RigidBody
          name={end.name}
          type="fixed"
          colliders="cuboid"
          userData={{ start: end.start, end: start.start }}
        >
          <mesh
            position={[
              end.pos[0],
              end.pos[1] + halfHeightPillar2,
              end.pos[2],
            ]}
          >
            <boxGeometry args={end.dimensions} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        {/* Zipline Cable (Cylinder) */}
        <mesh position={midpoint} quaternion={quaternion}>
          <cylinderGeometry args={[thickness, thickness, length, 8]} />
          <meshStandardMaterial color="red" />
        </mesh>

      </group>
    );
  }

  return <>{ziplines}</>;
};

export default Ziplines;
