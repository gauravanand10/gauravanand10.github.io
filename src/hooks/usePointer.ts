import { useEffect } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

/** Pointer position relative to an element, normalised to -1…1 (springs for smoothness). */
export function useElementPointer(ref: React.RefObject<HTMLElement | SVGElement>, stiffness = 90) {
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness, damping: 18, mass: 0.6 });
  const sy = useSpring(ny, { stiffness, damping: 18, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
        const y = ((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
        nx.set(Math.max(-1, Math.min(1, x)));
        ny.set(Math.max(-1, Math.min(1, y)));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [ref, nx, ny]);

  return { x: sx as MotionValue<number>, y: sy as MotionValue<number> };
}

export function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
