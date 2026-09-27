import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useElementPointer } from '../hooks/usePointer';

type Block = { id: string; label: string; sub: string; x: number; y: number; w: number; h: number };

const BLOCKS: Block[] = [
  { id: 'pe', label: 'PE ARRAY', sub: 'systolic · 4×4', x: 88, y: 88, w: 196, h: 196 },
  { id: 'mac', label: 'PA-MAC', sub: 'INT8 | BF16 · DP4', x: 304, y: 88, w: 168, h: 92 },
  { id: 'acc', label: 'ACCUM', sub: 'PD_ACC', x: 304, y: 192, w: 168, h: 92 },
  { id: 'sram', label: 'SRAM', sub: 'banked · 4×', x: 88, y: 304, w: 196, h: 80 },
  { id: 'fsm', label: 'CTRL', sub: 'FSM', x: 304, y: 304, w: 76, h: 80 },
  { id: 'clk', label: 'CLK', sub: 'H-tree', x: 396, y: 304, w: 76, h: 80 },
  { id: 'ahb', label: 'AHB', sub: 'HADDR · HWDATA · HRDATA', x: 88, y: 398, w: 384, h: 26 },
  { id: 'io', label: 'I/O → REAL SYSTEMS', sub: 'GPIO · UART · I²C · SPI · PWM', x: 88, y: 436, w: 384, h: 36 },
];

const PADS = Array.from({ length: 15 }, (_, i) => 70 + i * 30);

export default function SiliconDie() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const { x, y } = useElementPointer(wrap);
  const rotY = useTransform(x, [-1, 1], [-12, 12]);
  const rotX = useTransform(y, [-1, 1], [10, -10]);
  const l1x = useTransform(x, [-1, 1], [-4, 4]);
  const l1y = useTransform(y, [-1, 1], [-4, 4]);
  const l2x = useTransform(x, [-1, 1], [-10, 10]);
  const l2y = useTransform(y, [-1, 1], [-10, 10]);
  const l3x = useTransform(x, [-1, 1], [-18, 18]);
  const l3y = useTransform(y, [-1, 1], [-18, 18]);

  const [probe, setProbe] = useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState<string>('pe');
  const [autoCycle, setAutoCycle] = useState(true);

  // When nobody is hovering, walk the floorplan so the die always "does" something.
  useEffect(() => {
    if (!autoCycle) return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % BLOCKS.length;
      setActive(BLOCKS[i].id);
    }, 2200);
    return () => clearInterval(t);
  }, [autoCycle]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const s = svg.current;
    if (!s) return;
    const pt = s.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = s.getScreenCTM();
    if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    setProbe({ x: p.x, y: p.y });
    const hit = BLOCKS.find((b) => p.x >= b.x - 6 && p.x <= b.x + b.w + 6 && p.y >= b.y - 6 && p.y <= b.y + b.h + 6);
    if (hit) setActive(hit.id);
    setAutoCycle(false);
  };

  const cur = BLOCKS.find((b) => b.id === active)!;

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[560px] [perspective:1400px]">
      {/* glow */}
      <div aria-hidden className="absolute inset-[12%] rounded-[40px] bg-[radial-gradient(circle_at_50%_45%,rgba(79,212,255,0.18),rgba(143,124,255,0.10)_45%,transparent_70%)] blur-2xl" />

      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="relative h-full w-full will-change-transform">
        <svg
          ref={svg}
          viewBox="0 0 560 560"
          className="h-full w-full touch-none select-none"
          role="img"
          aria-label="Animated silicon die floorplan: processing-element array, PA-MAC, accumulator, SRAM banks, controller, clock tree, AHB bus and I/O to real systems"
          onPointerMove={onMove}
          onPointerLeave={() => { setProbe(null); setAutoCycle(true); }}
        >
          <defs>
            <linearGradient id="die-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0f1526" />
              <stop offset="1" stopColor="#090d18" />
            </linearGradient>
            <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgb(79 212 255)" stopOpacity=".7" />
              <stop offset=".5" stopColor="rgb(143 124 255)" stopOpacity=".35" />
              <stop offset="1" stopColor="rgb(79 212 255)" stopOpacity=".6" />
            </linearGradient>
            <pattern id="die-grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M12 0H0v12" fill="none" stroke="rgba(130,150,200,0.07)" strokeWidth=".6" />
            </pattern>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* ── L0: package + pad ring ── */}
          <g>
            <rect x="24" y="24" width="512" height="512" rx="22" fill="#070a12" stroke="rgba(130,150,200,0.18)" />
            {PADS.map((p) => (
              <g key={p} fill="#141b2e" stroke="rgba(130,150,200,0.28)" strokeWidth=".8">
                <rect x={p - 6} y="30" width="12" height="18" rx="2" />
                <rect x={p - 6} y="512" width="12" height="18" rx="2" />
                <rect x="30" y={p - 6} width="18" height="12" rx="2" />
                <rect x="512" y={p - 6} width="18" height="12" rx="2" />
              </g>
            ))}
            <rect x="60" y="60" width="440" height="440" rx="12" fill="url(#die-fill)" stroke="url(#edge)" strokeWidth="1.4" />
            <rect x="60" y="60" width="440" height="440" rx="12" fill="url(#die-grid)" />
          </g>

          {/* ── L1: routing + clock tree ── */}
          <motion.g style={{ x: l1x, y: l1y }}>
            {/* clock H-tree */}
            <g fill="none" stroke="rgb(143 124 255)" strokeOpacity=".35" strokeWidth="1.2">
              <path d="M280 72v404M140 180h280M140 120v120M420 120v120M140 340h280M140 310v60M420 310v60" />
            </g>
            <g fill="none" stroke="rgb(143 124 255)" strokeWidth="1.2" className="sig-slow">
              <path d="M280 72v404M140 180h280M140 340h280" />
            </g>
            {/* datapath routes */}
            <g fill="none" stroke="rgba(79,212,255,0.22)" strokeWidth="1.6">
              <path id="r-sram-pe" d="M186 304v-20" />
              <path d="M284 134h20" />
              <path d="M388 180v12" />
              <path d="M472 238h14v172h-14" />
              <path d="M280 424v12" />
              <path d="M342 304v-20" />
            </g>
            <g fill="none" stroke="rgb(79 212 255)" strokeWidth="1.6" className="sig-fast">
              <path d="M186 304v-20" />
              <path d="M284 134h20" />
              <path d="M388 180v12" />
              <path d="M472 238h14v172h-14" />
              <path d="M280 424v12" />
              <path d="M342 304v-20" />
            </g>
            {/* I/O fan-out to pads */}
            <g fill="none" stroke="rgb(79 212 255)" strokeOpacity=".28" strokeWidth="1">
              {[130, 190, 250, 310, 370, 430].map((px) => (
                <path key={px} d={`M${px} 472v18l${px < 280 ? -6 : 6} 8v14`} />
              ))}
            </g>
          </motion.g>

          {/* ── L2: functional blocks ── */}
          <motion.g style={{ x: l2x, y: l2y }}>
            {BLOCKS.map((b) => {
              const on = active === b.id;
              return (
                <g key={b.id}>
                  {on && <rect x={b.x - 3} y={b.y - 3} width={b.w + 6} height={b.h + 6} rx="9" fill="rgb(79 212 255)" opacity=".18" filter="url(#soft)" />}
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx="7"
                    fill={on ? 'rgba(79,212,255,0.08)' : 'rgba(20,27,46,0.85)'}
                    stroke={on ? 'rgb(79 212 255)' : 'rgba(130,150,200,0.28)'}
                    strokeWidth={on ? 1.4 : 1}
                    style={{ transition: 'all .35s ease' }}
                  />
                </g>
              );
            })}

            {/* PE grid inside PE ARRAY */}
            {Array.from({ length: 16 }, (_, k) => {
              const i = k % 4;
              const j = Math.floor(k / 4);
              return (
                <rect
                  key={k}
                  x={102 + i * 44}
                  y={116 + j * 40}
                  width="36"
                  height="32"
                  rx="4"
                  className="pe-cell"
                  style={{ animationDelay: `${(i + j) * 0.18}s` }}
                />
              );
            })}

            {/* MAC: INT8 | BF16 lanes */}
            <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="9">
              <rect x="316" y="124" width="68" height="44" rx="4" fill="rgba(79,212,255,0.08)" stroke="rgba(79,212,255,0.4)" />
              <rect x="392" y="124" width="68" height="44" rx="4" fill="rgba(143,124,255,0.08)" stroke="rgba(143,124,255,0.45)" />
              <text x="350" y="150" textAnchor="middle" fill="rgb(79 212 255)">INT8</text>
              <text x="426" y="150" textAnchor="middle" fill="rgb(143 124 255)">BF16</text>
            </g>

            {/* ACC bars */}
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={318 + i * 19} y="230" width="12" height="40" rx="2" fill="rgba(79,212,255,0.12)" stroke="rgba(79,212,255,0.25)" strokeWidth=".6">
                <animate attributeName="height" values="10;40;22;36;10" dur={`${2.4 + i * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="y" values="260;230;248;234;260" dur={`${2.4 + i * 0.2}s`} repeatCount="indefinite" />
              </rect>
            ))}

            {/* SRAM banks */}
            {Array.from({ length: 4 }, (_, i) => (
              <g key={i}>
                <rect x={98 + i * 46} y="330" width="40" height="44" rx="3" fill="rgba(143,124,255,0.07)" stroke="rgba(143,124,255,0.35)" strokeWidth=".8" />
                {Array.from({ length: 5 }, (_, r) => (
                  <path key={r} d={`M${102 + i * 46} ${336 + r * 8}h32`} stroke="rgba(143,124,255,0.3)" strokeWidth=".6" />
                ))}
              </g>
            ))}

            {/* FSM states */}
            <g fill="none" stroke="rgba(79,212,255,0.5)" strokeWidth=".9">
              <circle cx="324" cy="344" r="7" />
              <circle cx="360" cy="344" r="7" />
              <circle cx="342" cy="368" r="7" />
              <path d="M331 344h22M356 350l-9 12M336 362l-9-12" className="sig-fast" stroke="rgb(79 212 255)" />
            </g>

            {/* clock waveform */}
            <path d="M404 360h8v-14h14v14h14v-14h14v14h8" fill="none" stroke="rgb(143 124 255)" strokeWidth="1.3" />
            <circle cx="462" cy="318" r="3" fill="rgb(143 124 255)" className="clk" />

            {/* AHB bus lines */}
            <g stroke="rgb(79 212 255)" strokeWidth="1.2" fill="none">
              <path d="M100 407h360" strokeOpacity=".25" />
              <path d="M100 415h360" strokeOpacity=".25" />
              <path d="M100 407h360" className="sig" />
              <path d="M460 415H100" className="sig" style={{ animationDirection: 'reverse' }} />
            </g>
          </motion.g>

          {/* ── L3: labels ── */}
          <motion.g style={{ x: l3x, y: l3y }} fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" pointerEvents="none">
            {BLOCKS.filter((b) => b.id !== 'ahb').map((b) => (
              <g key={b.id}>
                <text x={b.x + 9} y={b.y + 16} fontSize="10" fontWeight="600" letterSpacing="1" fill={active === b.id ? '#ffffff' : 'rgba(197,203,224,0.8)'}>
                  {b.label}
                </text>
              </g>
            ))}
            <text x="300" y="415" fontSize="8" letterSpacing="1" fill="rgba(197,203,224,0.75)">AHB</text>
            <text x="280" y="62" fontSize="8" textAnchor="middle" letterSpacing="2" fill="rgba(143,124,255,0.8)">CLK ▼</text>
          </motion.g>

          {/* ── probe crosshair (layout-viewer ruler) ── */}
          {probe && (
            <g pointerEvents="none">
              <path d={`M${probe.x} 60V500M60 ${probe.y}H500`} stroke="rgba(255,95,134,0.45)" strokeWidth=".8" strokeDasharray="3 4" />
              <circle cx={probe.x} cy={probe.y} r="7" fill="none" stroke="rgb(255 95 134)" strokeWidth="1.2" />
              <circle cx={probe.x} cy={probe.y} r="1.8" fill="rgb(255 95 134)" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* readout */}
      <div className="pointer-events-none absolute -bottom-2 left-1/2 w-[92%] max-w-[420px] -translate-x-1/2 sm:bottom-0">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-900/85 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] backdrop-blur-md">
          <span className="flex items-center gap-2 text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-signal pulse" />
            {cur.label}
          </span>
          <span className="truncate text-mute">{cur.sub}</span>
          <span className="hidden text-spark sm:inline">
            {probe ? `x${String(Math.round(probe.x)).padStart(4, '0')} y${String(Math.round(probe.y)).padStart(4, '0')}` : 'probe idle'}
          </span>
        </div>
      </div>

      <style>{`
        .pe-cell { fill: rgba(79,212,255,0.06); stroke: rgba(79,212,255,0.28); stroke-width: .8; animation: pe-wave 2.6s ease-in-out infinite; }
        @keyframes pe-wave { 0%,100% { fill: rgba(79,212,255,0.05); stroke: rgba(79,212,255,0.22);} 35% { fill: rgba(79,212,255,0.32); stroke: rgba(79,212,255,0.9);} 60% { fill: rgba(143,124,255,0.12); stroke: rgba(143,124,255,0.5);} }
      `}</style>
    </div>
  );
}
