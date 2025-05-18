import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

const Map = () => {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="white" />
      </mesh>
     
    </RigidBody>
  )
}

// <gridHelper args={[50, 50]} />

export default Map