import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Mode = 'INT8' | 'BF16';
const C = { INT8: '79 212 255', BF16: '143 124 255' } as const;

/**
 * Conceptual PA-MAC datapath. Toggles between INT8 and BF16 (auto, or click the switch).
 * Shows the shared 8×8 multipliers, DP4 reduction, accumulator and the four UPF power domains.
 */
export default function PAMACDatapath({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('INT8');
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setMode((m) => (m === 'INT8' ? 'BF16' : 'INT8')), 3600);
    return () => clearInterval(t);
  }, [auto]);

  const c = C[mode];
  const on = (m: Mode) => mode === m;
  const col = (m: Mode, a = 1) => `rgb(${C[m]} / ${on(m) ? a : a * 0.25})`;

  return (
    <div className={`relative ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Precision mode" className="inline-flex rounded-full border border-white/10 bg-ink-900/80 p-1 font-mono text-[11px]">
          {(['INT8', 'BF16'] as Mode[]).map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={on(m)}
              onClick={() => { setMode(m); setAuto(false); }}
              className={`relative rounded-full px-4 py-1.5 tracking-[0.12em] transition-colors ${on(m) ? 'text-ink-950' : 'text-mute hover:text-white'}`}
            >
              {on(m) && <motion.span layoutId="pamac-mode" className="absolute inset-0 -z-0 rounded-full" style={{ background: `rgb(${C[m]})` }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
          mode = <span style={{ color: `rgb(${c})` }}>{mode}</span> · {mode === 'INT8' ? 'PD_FPU gated' : 'PD_FPU active'}
        </span>
      </div>

      <svg viewBox="0 0 640 392" className="h-auto w-full" role="img" aria-label={`PA-MAC datapath in ${mode} mode: operands, precision select, INT8 and BF16 lanes, four shared 8 by 8 multipliers, DP4 reduction and accumulator, grouped into power domains PD_AON, PD_CORE, PD_FPU and PD_ACC`}>
        <defs>
          <marker id="pm-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 8 4 0 8z" fill={`rgb(${c})`} />
          </marker>
        </defs>

        {/* power domains */}
        <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="9" letterSpacing="1">
          <rect x="196" y="4" width="248" height="110" rx="10" fill="none" stroke="rgba(197,203,224,0.3)" strokeDasharray="4 4" />
          <text x="206" y="18" fill="rgba(197,203,224,0.65)">PD_AON</text>
          <rect x="104" y="192" width="306" height="118" rx="10" fill="none" stroke="rgba(79,212,255,0.4)" strokeDasharray="4 4" />
          <text x="114" y="206" fill="rgba(79,212,255,0.8)">PD_CORE</text>
          <motion.g animate={{ opacity: on('BF16') ? 1 : 0.35 }} transition={{ duration: 0.5 }}>
            <rect x="416" y="118" width="208" height="192" rx="10" fill={on('BF16') ? 'rgba(143,124,255,0.04)' : 'rgba(0,0,0,0.25)'} stroke="rgba(143,124,255,0.55)" strokeDasharray="4 4" />
            <text x="426" y="302" fill="rgba(143,124,255,0.9)">PD_FPU{on('INT8') ? ' · OFF' : ''}</text>
          </motion.g>
          <rect x="172" y="318" width="172" height="68" rx="10" fill="none" stroke="rgba(255,95,134,0.45)" strokeDasharray="4 4" />
          <text x="182" y="380" fill="rgba(255,95,134,0.85)">PD_ACC</text>
        </g>

        {/* wires (static) */}
        <g fill="none" stroke="rgba(130,150,200,0.22)" strokeWidth="1.4">
          <path d="M320 54v20" />
          <path d="M300 104 140 130" />
          <path d="M340 104 510 130" />
          <path d="M140 172v14h230" />
          <path d="M510 172v24H150" />
          {[150, 222, 294, 366].map((x) => <path key={x} d={`M${x} 186v26M${x} 250l${(258 - x) * 0.4} 24`} />)}
          <path d="M520 172v44" />
          <path d="M440 256H334" />
          <path d="M258 304v24" />
          <path d="M328 348h20v-60h-14" />
        </g>

        {/* active signal overlay */}
        <g fill="none" stroke={`rgb(${c})`} strokeWidth="1.6" className="sig-fast" style={{ transition: 'stroke .4s' }}>
          <path d="M320 54v20" />
          {on('INT8') ? <path d="M300 104 140 130" /> : <path d="M340 104 510 130" />}
          {on('INT8') ? <path d="M140 172v14h230" /> : <path d="M510 172v24H150" />}
          {[150, 222, 294, 366].map((x) => <path key={x} d={`M${x} ${on('INT8') ? 186 : 196}v${on('INT8') ? 26 : 16}M${x} 250l${(258 - x) * 0.4} 24`} />)}
          {on('BF16') && <path d="M520 172v44M440 256H334" />}
          <path d="M258 304v24" />
          <path d="M328 348h20v-60h-14" />
        </g>

        <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" textAnchor="middle">
          {/* operands */}
          <rect x="226" y="24" width="188" height="30" rx="6" fill="#0e1322" stroke="rgba(130,150,200,0.35)" />
          <text x="320" y="43" fontSize="10.5" fill="#e6eaf6">a[0:3] · b[0:3]</text>

          {/* mode mux */}
          <path d="M268 74h104l-16 30h-72z" fill="#0e1322" stroke={`rgb(${c})`} strokeWidth="1.3" style={{ transition: 'stroke .4s' }} />
          <text x="320" y="93" fontSize="10" fill={`rgb(${c})`}>PRECISION</text>

          {/* INT8 lane */}
          <rect x="60" y="130" width="160" height="42" rx="6" fill={on('INT8') ? 'rgba(79,212,255,0.1)' : '#0b0f1b'} stroke={col('INT8')} strokeWidth="1.2" />
          <text x="140" y="148" fontSize="11" fontWeight="600" fill={col('INT8')}>INT8 LANE</text>
          <text x="140" y="163" fontSize="8.5" fill="rgba(197,203,224,0.6)">signed 8-bit</text>

          {/* BF16 lane */}
          <rect x="424" y="130" width="176" height="42" rx="6" fill={on('BF16') ? 'rgba(143,124,255,0.1)' : '#0b0f1b'} stroke={col('BF16')} strokeWidth="1.2" />
          <text x="512" y="148" fontSize="11" fontWeight="600" fill={col('BF16')}>BF16 LANE</text>
          <g fontSize="8.5">
            <text x="470" y="163" fill="rgba(255,95,134,0.8)">s</text>
            <text x="503" y="163" fill={col('BF16', 0.9)}>e[7:0]</text>
            <text x="556" y="163" fill="rgba(197,203,224,0.7)">1.m[6:0]</text>
          </g>

          {/* exponent unit */}
          <rect x="440" y="216" width="164" height="72" rx="6" fill="#0b0f1b" stroke={col('BF16', 0.8)} />
          <text x="522" y="240" fontSize="10" fill={col('BF16')}>EXP ADD</text>
          <text x="522" y="256" fontSize="10" fill={col('BF16')}>ALIGN · NORM</text>
          <text x="522" y="276" fontSize="8" fill="rgba(197,203,224,0.5)">FP-only logic</text>

          {/* shared multipliers */}
          {[150, 222, 294, 366].map((x, i) => (
            <g key={x}>
              <rect x={x - 30} y="212" width="60" height="38" rx="6" fill={`rgb(${c} / 0.12)`} stroke={`rgb(${c})`} strokeWidth="1.2" style={{ transition: 'all .4s' }}>
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </rect>
              <text x={x} y="235" fontSize="11" fontWeight="600" fill="#fff">8×8</text>
            </g>
          ))}
          <text x="258" y="206" fontSize="8" fill="rgba(197,203,224,0.55)">shared multipliers</text>

          {/* DP4 */}
          <rect x="188" y="274" width="140" height="30" rx="6" fill="#0e1322" stroke={`rgb(${c})`} strokeWidth="1.2" />
          <text x="258" y="293" fontSize="11" fontWeight="600" fill="#fff">DP4 · Σ aᵢbᵢ</text>

          {/* ACC */}
          <rect x="188" y="328" width="140" height="36" rx="6" fill="rgba(255,95,134,0.08)" stroke="rgb(255 95 134)" strokeWidth="1.2" />
          <text x="258" y="350" fontSize="11" fontWeight="600" fill="#fff">ACCUMULATOR</text>
        </g>
      </svg>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute/70">Conceptual block diagram · click INT8 / BF16 to switch</p>
    </div>
  );
}
