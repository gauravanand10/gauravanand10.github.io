import { useEffect, useRef, useState } from 'react';

const COLS = 12;
const ROWS = 8;

/** FPGA fabric: CLB tiles, BRAM / DSP columns, switch boxes. Tiles near the cursor get "configured". */
export default function FPGAFabric() {
  const ref = useRef<SVGSVGElement>(null);
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setTick((t) => t + 1), 420);
    return () => clearInterval(id);
  }, []);

  const W = 44;
  const G = 14;
  const kind = (c: number) => (c === 3 ? 'BRAM' : c === 8 ? 'DSP' : 'CLB');
  const seed = (c: number, r: number) => ((c * 73 + r * 151 + tick * 37) % 97) / 97;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${COLS * (W + G) + G} ${ROWS * (W + G) + G}`}
      className="h-auto w-full cursor-crosshair"
      role="img"
      aria-label="Stylised FPGA fabric of CLB tiles with BRAM and DSP columns; tiles near the cursor light up as if configured"
      onPointerMove={(e) => {
        const s = ref.current!;
        const pt = s.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const q = pt.matrixTransform(s.getScreenCTM()!.inverse());
        setP({ x: q.x, y: q.y });
      }}
      onPointerLeave={() => setP(null)}
    >
      {/* routing channels */}
      <g stroke="rgba(130,150,200,0.1)">
        {Array.from({ length: ROWS + 1 }, (_, r) => <path key={`h${r}`} d={`M0 ${r * (W + G) + G / 2}H${COLS * (W + G) + G}`} />)}
        {Array.from({ length: COLS + 1 }, (_, c) => <path key={`v${c}`} d={`M${c * (W + G) + G / 2} 0V${ROWS * (W + G) + G}`} />)}
      </g>
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const x = G + c * (W + G);
        const y = G + r * (W + G);
        const k = kind(c);
        const d = p ? Math.hypot(p.x - (x + W / 2), p.y - (y + W / 2)) : 999;
        const near = d < 90;
        const ambient = !p && seed(c, r) > 0.82;
        const col = k === 'BRAM' ? '143 124 255' : k === 'DSP' ? '255 95 134' : '79 212 255';
        const lit = near || ambient;
        const a = near ? Math.max(0.2, 1 - d / 90) : ambient ? 0.55 : 0;
        return (
          <g key={i}>
            <rect x={x} y={y} width={W} height={W} rx="5" fill={lit ? `rgb(${col} / ${0.08 + a * 0.3})` : '#0c111f'} stroke={lit ? `rgb(${col} / ${0.4 + a * 0.6})` : 'rgba(130,150,200,0.2)'} style={{ transition: 'fill .35s, stroke .35s' }} />
            {k === 'CLB' ? (
              <g fill={lit ? `rgb(${col} / ${0.3 + a * 0.7})` : 'rgba(130,150,200,0.18)'}>
                <rect x={x + 8} y={y + 8} width="11" height="11" rx="2" />
                <rect x={x + 25} y={y + 8} width="11" height="11" rx="2" />
                <rect x={x + 8} y={y + 25} width="11" height="11" rx="2" />
                <rect x={x + 25} y={y + 25} width="11" height="11" rx="2" />
              </g>
            ) : (
              <text x={x + W / 2} y={y + W / 2 + 3} textAnchor="middle" fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="8.5" fill={lit ? '#fff' : 'rgba(197,203,224,0.4)'}>{k}</text>
            )}
            <rect x={x + W + 3} y={y + W + 3} width="8" height="8" rx="1.5" fill="none" stroke="rgba(130,150,200,0.25)" />
          </g>
        );
      })}
    </svg>
  );
}
