import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** Card that tilts a few degrees toward the cursor and shows a soft probe-light where the pointer is. */
export default function TiltCard({ children, className = '', max = 4 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotY = useTransform(sx, [0, 1], [-max, max]);
  const rotX = useTransform(sy, [0, 1], [max, -max]);
  const glow = useTransform([sx, sy] as never, ([x, y]: number[]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(79,212,255,0.09), transparent 60%)`);

  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (!fine) return;
        const r = ref.current!.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
      style={fine ? { rotateX: rotX, rotateY: rotY, transformPerspective: 1600 } : undefined}
      className={`group relative overflow-hidden rounded-3xl border border-line bg-ink-900/70 backdrop-blur-sm transition-colors duration-500 hover:border-white/15 ${className}`}
    >
      {fine && <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: glow }} />}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
