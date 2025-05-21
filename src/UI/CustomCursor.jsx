import './CustomCursor.css'

import { useEffect, useRef } from 'react'
import { usePointerStore } from '../GlobalStateManager/usePointerStore'

const CustomCursor = () => {
  const cursorType = usePointerStore((s) => s.cursorType)
  const isFiring = usePointerStore((s) => s.isFiring)
  const cursorRef = useRef()

  if (!cursorType) return null

  // Only move with mouse when in selector mode
  useEffect(() => {
    const handleMove = (e) => {
      const cursor = cursorRef.current
      if (cursorType === 'selector' && cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [cursorType])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${cursorType} ${isFiring ? 'firing' : ''}`}
      style={{
        ...(cursorType !== 'selector'
          ? {
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }
          : {
              top: 0,left: 0,
            }
          ),
      }}
    />
  )
}

export default CustomCursor
