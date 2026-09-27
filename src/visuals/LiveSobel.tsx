import { useCallback, useEffect, useRef, useState } from 'react';

const N = 14;

/** Tiny live Sobel demo: a bright disc follows the pointer, the edge map is computed with the same |Gx|+|Gy| the accelerator uses. */
export default function LiveSobel({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [c, setC] = useState({ x: 6.5, y: 6.5 });
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t = 0;
    const id = setInterval(() => {
      t += 0.08;
      setC({ x: 6.5 + Math.cos(t) * 3.2, y: 6.5 + Math.sin(t * 1.3) * 3.2 });
    }, 60);
    return () => clearInterval(id);
  }, [auto]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setAuto(false);
    const half = r.width / 2;
    const px = ((e.clientX - r.left) % half) / half;
    setC({ x: px * N, y: ((e.clientY - r.top) / r.height) * N });
  }, []);

  const img: number[][] = [];
  for (let y = 0; y < N; y++) {
    img.push([]);
    for (let x = 0; x < N; x++) {
      const d = Math.hypot(x + 0.5 - c.x, y + 0.5 - c.y);
      const box = x >= 1 && x <= 4 && y >= 9 && y <= 12 ? 160 : 0;
      img[y].push(Math.max(d < 3.2 ? 220 : 20, box));
    }
  }
  const at = (x: number, y: number) => img[Math.max(0, Math.min(N - 1, y))][Math.max(0, Math.min(N - 1, x))];
  const edge: number[][] = img.map((row, y) =>
    row.map((_, x) => {
      const gx = -at(x - 1, y - 1) + at(x + 1, y - 1) - 2 * at(x - 1, y) + 2 * at(x + 1, y) - at(x - 1, y + 1) + at(x + 1, y + 1);
      const gy = -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1) + at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1);
      return Math.min(255, (Math.abs(gx) + Math.abs(gy)) / 4);
    }),
  );

  const Grid = ({ m, tint }: { m: number[][]; tint: string }) => (
    <div className="grid aspect-square w-full gap-[2px]" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {m.flat().map((v, i) => (
        <div key={i} className="rounded-[2px]" style={{ background: `rgb(${tint} / ${0.04 + (v / 255) * 0.96})` }} />
      ))}
    </div>
  );

  return (
    <div className={className}>
      <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setAuto(true)} className="grid cursor-crosshair grid-cols-2 gap-4" role="img" aria-label="Live Sobel illustration: input image on the left, computed edge magnitude on the right">
        <Grid m={img} tint="197 203 224" />
        <Grid m={edge} tint="79 212 255" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
        <span>input · move cursor</span>
        <span>|Gx| + |Gy| · computed live</span>
      </div>
    </div>
  );
}
