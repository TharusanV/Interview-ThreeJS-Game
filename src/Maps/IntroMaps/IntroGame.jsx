import { useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useGameStore, gameStates } from '../../GlobalStateManager/useGameStore';
import CharacterModel from '../../Entities/CharacterModel'
import * as THREE from "three";

import { Physics, RigidBody } from '@react-three/rapier'
import Player from '../../Entities/Player/Player'
import { InterogrationRoom } from '../IntroMaps/InterogrationRoom'

import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

import { useHelper,} from '@react-three/drei'

import { DirectionalLightHelper } from 'three'

import IntroCinematic from "./IntroCinematic"
import { Hallway } from "./Hallway";

const Lights = () => {
  const mainLight = useRef()

  useHelper(mainLight, DirectionalLightHelper, 1, 'hotpink')

  return (
    <>
      <ambientLight intensity={1} />

      <directionalLight
        ref={mainLight}
        position={[0, 30, 0]}
        intensity={0.9}
        castShadow
      />

      {mainLight.current && (
        <primitive object={mainLight.current.target} position={[-0.5, 0.5, -0.5]} />
      )}

      <directionalLight position={[-5, -3, -10]} intensity={0.1} />
    </>
  )
}


const IntroGame = () => {
  const isCinematicPlaying = useGameStore(state => state.isCinematicPlaying);
  const gameState = useGameStore(state => state.gameState);

  return (
    <>
      {(isCinematicPlaying && gameState === gameStates.INGAME) && <IntroCinematic/>}
      
      <Lights />
                
      <Physics gravity={[0, -9.81, 0]} debug>
        <Hallway />
        {/*<InterogrationRoom />*/}
         <Player modelScale={[3,3,3]}/>
      </Physics>

    </>
  );
}

export default IntroGame