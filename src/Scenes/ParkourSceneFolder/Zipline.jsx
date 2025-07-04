import React from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

const Zipline = ({ startCoord = [-10, 0, 0], startDimensions = [0.1,5,0.1], endCoord = [10, 0, 0], endDimensions = [0.1,15,0.1] }) => {
  const halfHeightPillar1 = startDimensions[1] / 2;

  const halfHeightPillar2 = endDimensions[1] / 2

  const thickness = 0.05;

  const ziplineStart = [
    startCoord[0],
    startDimensions[1],
    startCoord[2],
  ];

  const ziplineEnd = [
    endCoord[0],
    endDimensions[1],
    endCoord[2],
  ];

    // Compute values for cylinder positioning & rotation
  const startVec = new THREE.Vector3(...ziplineStart);
  const endVec = new THREE.Vector3(...ziplineEnd);

  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

  // Cylinder default direction is along Y axis, rotate to align with zipline direction
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());


  return (
    <>
      {/* Start Pillar */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[startCoord[0], startCoord[1] + halfHeightPillar1, startCoord[2]]}>
          <boxGeometry args={startDimensions} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* End Pillar */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[endCoord[0], endCoord[1] + halfHeightPillar2, endCoord[2]]}>
          <boxGeometry args={endDimensions} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* Zipline Cable (Cylinder) */}
      <mesh position={midpoint} quaternion={quaternion}>
        <cylinderGeometry args={[thickness, thickness, length, 8]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}

export default Zipline;