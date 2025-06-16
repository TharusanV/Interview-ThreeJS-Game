import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

import { usePlayerStore } from "../GlobalStateManager/usePlayerStore";
import { useGameStore } from "../GlobalStateManager/useGameStore";
import { useMovementHandler } from '../CustomHooks/useMovementHandler'

const MOVE_SPEED = 7
const JUMP_FORCE = 5;

export default function ModelWithCamera({ spawnPoint = [0, 0, 0], modelScale }) {
  const { scene, cameras } = useGLTF('/helpme.glb')
  const { camera: mainCamera, gl } = useThree()
  const glbSceneRef = useRef()
  const glbCamera = cameras?.[0] || null
  const rotationY = useRef(0) // yaw
  const pitch = useRef(0) // pitch

  const mixerRef = useRef();
  const [actions, setActions] = useState({});
  const [currentAction, setCurrentAction] = useState(null);
  const idleAnim = useGLTF('/Animations/Idle.glb');
  const forwardAnim = useGLTF('/Animations/Running.glb');
  const jumpingOverBoxAnim = useGLTF('/Animations/jumpingOverBox.glb');
  
  
  const playerRef = useRef();
  const { forward, backward, left, right, spacebar } = useMovementHandler()
  const [animationState, setAnimationState] = useState("idle");
  const nextInputQueueRef = useRef([]);
  const isGroundedRef = useRef(true);
  const isJumpingRef = useRef(false);
  const isAttackingRef = useRef(false);
  
  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  const setAnimation = usePlayerStore((state) => state.setPlayerAnimation);
  const canMove = useGameStore((state) => state.canMove);

  const jumpFunction = () => {
    if (!isGroundedRef.current || isJumpingRef.current) return;

    isJumpingRef.current = true;
    isGroundedRef.current = false;

    // Apply physics jump
    playerRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 });

    // Set jump animation and queue next (limit to 1)
    setAnimationState('jumpingOverBox');
  };


  const valutFunction = () => {

  }  

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef);
      setAnimation(animationState);
    }
  }, [playerRef, animationState]);


  // Setup mixer and actions
  useEffect(() => {
    if (!scene) return;

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    const animActions = {
      idle: mixer.clipAction(idleAnim.animations[0]),
      forward: mixer.clipAction(forwardAnim.animations[0]),
      jumpingOverBox: mixer.clipAction(jumpingOverBoxAnim.animations[0]),

    };

    // Set custom playback speed
    //animActions.forward.setEffectiveTimeScale(0.6);

    setActions(animActions);

    return () => {
      mixer.stopAllAction();
    };
  }, [scene, idleAnim]);  

    // Animation transition logic
    useEffect(() => {
      if (!actions || !mixerRef.current) return;
  
      const mixer = mixerRef.current;
      const newAction = actions[animationState];
      const prevAction = actions[currentAction];
  
      if (animationState !== currentAction && newAction) {
        if (animationState !== currentAction && newAction) {
          prevAction?.fadeOut(0.1);
          newAction.reset();

          if (['idle', 'forward'].includes(animationState)) {
            newAction.setLoop(THREE.LoopRepeat);
            newAction.clampWhenFinished = false;
          } else {
            newAction.setLoop(THREE.LoopOnce, 1);
            newAction.clampWhenFinished = true;

            const onFinish = () => {
              mixer.removeEventListener('finished', onFinish);

              isJumpingRef.current = false; // Re-enable jumping/movement
              if (nextInputQueueRef.current.length > 0) {
                setAnimationState(nextInputQueueRef.current.shift());
              } else {
                setAnimationState('idle');
              }
            };

            mixer.addEventListener('finished', onFinish);
          }

          newAction.fadeIn(0.1).play();
          setCurrentAction(animationState);
        }

      }
    }, [animationState, actions, currentAction, nextInputQueueRef, setAnimationState]);

  // Pointer Lock
  useEffect(() => {
    const canvas = gl.domElement
    const isPointerLocked = () => document.pointerLockElement === canvas

    const onMouseMove = (e) => {
      if (!isPointerLocked()) return

      rotationY.current -= e.movementX * 0.002
      pitch.current += e.movementY * 0.002
      pitch.current = THREE.MathUtils.clamp(pitch.current, -Math.PI / 3, Math.PI / 3)

      if (glbSceneRef.current) {
        glbSceneRef.current.rotation.y = rotationY.current
      }
    }

    canvas.addEventListener('click', () => canvas.requestPointerLock())
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl])

  // Movement
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

    if (!glbCamera || !playerRef.current) return

    // Get camera direction
    const camDir = new THREE.Vector3()
    mainCamera.getWorldDirection(camDir)
    camDir.y = 0
    camDir.normalize()

    const camRight = new THREE.Vector3()
    camRight.crossVectors(camDir, mainCamera.up).normalize()

    if (spacebar && isGroundedRef.current && !isJumpingRef.current) {
      jumpFunction();
    }

    const direction = new THREE.Vector3()
    if (forward) direction.add(camDir)
    if (backward) direction.sub(camDir)
    if (left) direction.sub(camRight)
    if (right) direction.add(camRight)

    const velocity = playerRef.current.linvel()
    const isMoving = direction.lengthSq() > 0

    if (isMoving && !isJumpingRef.current) {
      direction.normalize().multiplyScalar(MOVE_SPEED);
      playerRef.current.wakeUp();
      playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
      setAnimationState("forward");
    } else {
      if (!isJumpingRef.current) {
        if (velocity.x !== 0 || velocity.z !== 0) {
          playerRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 });
        }
        setAnimationState("idle");
      }
    }



    // Camera tracking to bone-attached glbCamera
    if (glbCamera) {
      const pos = new THREE.Vector3()
      const quat = new THREE.Quaternion()
      const scale = new THREE.Vector3()
      glbCamera.matrixWorld.decompose(pos, quat, scale)

      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        pitch.current
      )
      quat.multiply(pitchQuat)

      mainCamera.position.copy(pos)
      mainCamera.quaternion.copy(quat)
    }
  })

  return (
    <RigidBody
      ref={playerRef}
      position={spawnPoint}
      colliders={false}
      lockRotations
      name="Player"
    >
      <CapsuleCollider position={[0, 0.875, 0]} args={[1.25, 0.25]} 
        onCollisionEnter={({other}) => {
          if(other.rigidBodyObject.name === "ground"){
            isGroundedRef.current = true;
          }
        }}
        onCollisionExit={({other}) => {
          if(other.rigidBodyObject.name === "ground"){
            isGroundedRef.current = false;
          }
        }}
      />

      <primitive object={scene} ref={glbSceneRef} position={[0, 0, 0]} />
    </RigidBody>
  )
}
