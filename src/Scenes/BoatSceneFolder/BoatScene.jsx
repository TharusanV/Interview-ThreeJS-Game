import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo } from 'react'

import Ocean from './Ocean'
import RealisticWater from './RealisticWater'

export default function BoatScene() {
  return (
    <>
      <RealisticWater
        width={100}
        height={100}
        speed={1}
        waveHeight={0.6}
        waveFrequency={2.0}
      />
    </>
  )
}


/*

<Ocean width={50} height={50} speed={1} waveHeight={0.3} waveFrequency={2} />



*/