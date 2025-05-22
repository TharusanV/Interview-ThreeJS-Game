import './CustomCursor.css';
import { useEffect, useRef } from 'react';
import { usePointerStore } from '../GlobalStateManager/usePointerStore';

const CustomCursor = () => {
  const cursorType = usePointerStore((s) => s.cursorType);
  const isFiring = usePointerStore((s) => s.isFiring);
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMove = (e) => {
      if (!cursor) return;

      // Move only in selector mode
      if (cursorType === 'selector') {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
        cursor.style.transform = 'translate(0, 0)';
      }
    };

    if (cursorType === 'selector') {
      window.addEventListener('mousemove', handleMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, [cursorType]);

  if (!cursorType) return null;

  const isSelector = cursorType === 'selector';

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${cursorType} ${isFiring ? 'firing' : ''}`}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        ...(isSelector
          ? { top: 0, left: 0, transform: 'translate(0, 0)' }
          : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
      }}
    />
  );
};

export default CustomCursor;
