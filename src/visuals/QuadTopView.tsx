import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { useElementPointer } from '../hooks/usePointer';

/**
 * Top view of an X-frame quad. The pointer acts as the pilot's stick: roll/pitch
 * commands are mixed onto M1–M4 exactly like an X-quad mixer (illustration).
 */
export default function QuadTopView({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useElementPointer(ref, 60);
  const rotY = useTransform(x, [-1, 1], [-16, 16]);
  const rotX = useTransform(y, [-1, 1], [16, -16]);
  const [cmd, setCmd] = useState({ r: 0, p: 0 });
  useMotionValueEvent(x, 'change', (v) => setCmd((c) => ({ ...c, r: v })));
  useMotionValueEvent(y, 'change', (v) => setCmd((c) => ({ ...c, p: v })));

  const T = 0.55;
  const k = 0.3;
  // M1 front-left, M2 front-right, M3 rear-right, M4 rear-left (the craft tilts toward the cursor: that side's motors slow down)
  const m = [
    T + k * cmd.r + k * cmd.p, // M1 FL
    T - k * cmd.r + k * cmd.p, // M2 FR
    T - k * cmd.r - k * cmd.p, // M3 RR
    T + k * cmd.r - k * cmd.p, // M4 RL
  ].map((v) => Math.max(0.1, Math.min(1, v)));
  const pos = [
    [70, 70],
    [250, 70],
    [250, 250],
    [70, 250],
  ];
  const us = (v: number) => Math.round(1000 + v * 1000);

  return (
    <div ref={ref} className={`grid items-center gap-5 sm:grid-cols-[1.2fr_1fr] ${className}`}>
      <div className="[perspective:900px]">
        <motion.svg style={{ rotateX: rotX, rotateY: rotY }} viewBox="0 0 320 320" className="h-auto w-full" role="img" aria-label="Quadcopter top view with motors M1 to M4 around an ESP32 flight controller">
          <text x="160" y="16" textAnchor="middle" fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill="rgba(197,203,224,0.6)">FRONT ▲</text>
          <g stroke="rgba(197,203,224,0.35)" strokeWidth="9" strokeLinecap="round">
            <path d="M70 70 250 250M250 70 70 250" />
          </g>
          {pos.map(([cx, cy], i) => (
            <g key={i}>
              <path d={`M160 160 L${cx} ${cy}`} stroke="rgb(79 212 255)" strokeWidth="1.6" className="sig-fast" />
              <circle cx={cx} cy={cy} r="46" fill="rgba(79,212,255,0.04)" stroke="rgba(79,212,255,0.25)" strokeDasharray="3 5" />
              <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: `spin ${0.9 - m[i] * 0.6}s linear infinite ${i % 2 ? 'reverse' : ''}` }}>
                <ellipse cx={cx} cy={cy} rx="42" ry="6" fill="rgba(197,203,224,0.18)" />
                <ellipse cx={cx} cy={cy} rx="6" ry="42" fill="rgba(197,203,224,0.1)" />
              </g>
              <circle cx={cx} cy={cy} r="12" fill="#0e1322" stroke="rgb(143 124 255)" strokeWidth="1.5" />
              <text x={cx} y={cy + 3.5} textAnchor="middle" fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#fff">M{i + 1}</text>
            </g>
          ))}
          <rect x="128" y="132" width="64" height="56" rx="7" fill="#0e1322" stroke="rgb(79 212 255)" />
          <text x="160" y="156" textAnchor="middle" fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#fff">ESP32</text>
          <text x="160" y="171" textAnchor="middle" fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="7.5" fill="rgba(197,203,224,0.6)">MPU6050</text>
        </motion.svg>
      </div>
      <div className="font-mono text-[11px]">
        <p className="label mb-3 !text-[9.5px]">motor mixing · ESC pulse</p>
        {m.map((v, i) => (
          <div key={i} className="mb-2.5">
            <div className="mb-1 flex justify-between text-fog">
              <span>M{i + 1} <span className="text-mute">{['FL', 'FR', 'RR', 'RL'][i]}</span></span>
              <span className="text-signal">{us(v)} µs</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-signal to-volt transition-[width] duration-150" style={{ width: `${v * 100}%` }} />
            </div>
          </div>
        ))}
        <p className="mt-3 text-[9.5px] leading-relaxed text-mute/70">Move the cursor to command roll / pitch. Illustration of X-quad mixing; ESC range 1000–2000 µs @ 500 Hz as in the firmware.</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
