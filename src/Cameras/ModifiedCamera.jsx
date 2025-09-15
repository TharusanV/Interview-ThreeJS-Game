import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";

export default function ModifiedCamera({ position = [0.2, 1.2, -0.07], rotation = [0, degToRad(90), 0], fov = 80 }) {
  const { camera } = useThree();

  useEffect(() => {
    // Update position
    camera.position.set(...position);

    // Update rotation
    camera.rotation.set(...rotation);

    // Update FOV and recalc projection
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, position, rotation, fov]);

  return null; // Nothing rendered, just modifies the default camera
}
