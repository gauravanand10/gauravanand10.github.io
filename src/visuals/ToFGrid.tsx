import { useEffect, useRef, useState } from 'react';

/** Simulated 8×8 depth frame (64 zones). An "object" drifts, or follows the pointer. Colour = distance. */
export default function ToFGrid({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [o, setO] = useState({ x: 3.5, y: 3.5 });
  const [seq, setSeq] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t = 0;
    const id = setInterval(() => {
      t += 0.12;
      setSeq((s) => s + 1);
      if (auto) setO({ x: 3.5 + Math.sin(t) * 2.4, y: 3.5 + Math.cos(t * 0.7) * 2 });
    }, 110);
    return () => clearInterval(id);
  }, [auto]);

  const zones = Array.from({ length: 64 }, (_, i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const d = Math.hypot(x - o.x, y - o.y);
    const mm = Math.round(Math.min(1800, 350 + d * d * 55 + (y > 6 ? -200 : 0)));
    return mm;
  });
  const color = (mm: number) => {
    const k = 1 - (mm - 150) / 1650; // near → 1
    const r = Math.round(79 + (255 - 79) * Math.max(0, k - 0.55) * 2.2);
    const g = Math.round(212 * (1 - Math.max(0, k - 0.5)) * 0.9 + 40);
    const b = Math.round(255 * (0.55 + 0.45 * (1 - k)));
    return `rgba(${Math.min(255, r)},${g},${b},${0.15 + k * 0.85})`;
  };

  return (
    <div className={className}>
      <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
        <span>VL53L5CX · 8×8</span>
        <span>seq {String(seq).padStart(5, '0')}</span>
      </div>
      <div
        ref={ref}
        className="grid aspect-square cursor-crosshair grid-cols-8 gap-[3px] rounded-xl border border-line bg-ink-950/60 p-2"
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          setAuto(false);
          setO({ x: ((e.clientX - r.left) / r.width) * 8 - 0.5, y: ((e.clientY - r.top) / r.height) * 8 - 0.5 });
        }}
        onPointerLeave={() => setAuto(true)}
        role="img"
        aria-label="Simulated 8 by 8 time-of-flight depth frame"
      >
        {zones.map((mm, i) => (
          <div key={i} className="relative grid place-items-center rounded-[4px] transition-colors duration-150" style={{ background: color(mm) }}>
            <span className="hidden font-mono text-[8px] text-white/80 sm:block">{mm}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mute/80">
        <span>near</span>
        <span className="h-1.5 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(255,120,200,1), rgba(79,212,255,0.8), rgba(60,90,200,0.25))' }} />
        <span>far · mm (simulated)</span>
      </div>
    </div>
  );
}
