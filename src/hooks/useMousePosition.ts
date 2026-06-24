import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Track mouse position normalized to [-1, 1] for tilt/parallax effects.
 * Returns a ref so we don't trigger React re-renders on every move.
 */
export function useMousePositionRef(): React.MutableRefObject<MousePosition> {
  const position = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

/**
 * Hook that drives a continuous render loop, exposing the latest
 * mouse position via React state. Useful for parallax layers that
 * need to re-render every frame.
 */
export function useMouseTracker(): MousePosition {
  const position = useRef<MousePosition>({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let raf: number;
    const loop = () => {
      setTick((t) => (t + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // touch tick so React notices the ref change
  void tick;
  return position.current;
}