import { useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useGameStore, gameStates } from '../../GlobalStateManager/useGameStore';
import CharacterModel from '../../Entities/CharacterModel'
import * as THREE from "three";

import { Physics, RigidBody } from '@react-three/rapier'
import Player from '../../Entities/Player/Player'
import { InterogrationRoom } from './InterogrationRoom'

import {
  useHelper,
} from '@react-three/drei'

import { DirectionalLightHelper } from 'three'
import Map1Intro from "./Map1Intro";


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


const Map1 = () => {
  const isCinematicPlaying = useGameStore(state => state.isCinematicPlaying);
  const gameState = useGameStore(state => state.gameState);

  return (
    <>
      {(isCinematicPlaying && gameState === gameStates.INGAME) && <Map1Intro/>}

      <Lights />
                
      <Physics gravity={[0, -9.81, 0]} debug>
        <InterogrationRoom />

        <CharacterModel modelPosition={[0.35, 0.1, 3]} />
        
        <Player />
      </Physics>
    </>
  );
};

export default Map1;
