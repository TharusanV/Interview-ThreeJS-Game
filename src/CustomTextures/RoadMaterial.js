import * as THREE from 'three'
import { useMemo } from 'react'

export default function useRoadTexture() {
  const texture = useMemo(() => {
    const texWidth = 512
    const texHeight = 512
    const canvas = document.createElement('canvas')
    canvas.width = texWidth
    canvas.height = texHeight
    const ctx = canvas.getContext('2d')

    // Fill road background
    ctx.fillStyle = '#2b2b2b'
    ctx.fillRect(0, 0, texWidth, texHeight)

    // Center line specs (3m line, 6m gap = 9m cycle)
    const cycleLength = 9
    const lineLength = 3
    const gapLength = 6

    // Convert 100mm width to texture units
    const roadWorldWidth = 4 // meters
    const centerLineWidthMeters = 0.1
    const centerLineWidthPx = (centerLineWidthMeters / roadWorldWidth) * texWidth

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = centerLineWidthPx

    // Draw dashed center line vertically (middle of canvas width)
    const centerX = texWidth / 2

    const metersPerTexel = cycleLength / texHeight // 9m = 512px
    const pixelsPerMeter = 1 / metersPerTexel

    let y = 0
    while (y < texHeight) {
      const linePx = lineLength * pixelsPerMeter
      ctx.beginPath()
      ctx.moveTo(centerX, y)
      ctx.lineTo(centerX, y + linePx)
      ctx.stroke()
      y += (lineLength + gapLength) * pixelsPerMeter
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 20) // Repeat vertically

    return texture
  }, [])

  return texture
}
