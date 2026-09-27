import { useEffect, useState } from 'react';

type Tx = { burst: 'SINGLE' | 'INCR4' | 'WRAP4'; write: boolean; addrs: number[]; slave: number };

const wrap4 = (a: number) => {
  const base = a & ~0xf; // same rule as ahb_master.v: wrap_base = addr & 32'hFFFF_FFF0
  const out = [a];
  for (let i = 1; i < 4; i++) {
    const n = out[i - 1] + 4;
    out.push(n >= base + 16 ? base : n);
  }
  return out;
};

const TXS: Tx[] = [
  { burst: 'SINGLE', write: true, addrs: [0x0010], slave: 0 },
  { burst: 'INCR4', write: false, addrs: [0x1020, 0x1024, 0x1028, 0x102c], slave: 1 },
  { burst: 'WRAP4', write: true, addrs: wrap4(0x2038), slave: 2 },
];

const hex = (n: number) => `0x${n.toString(16).toUpperCase().padStart(4, '0')}`;

export default function AHBBus({ className = '', showPanel = true, wide = false }: { className?: string; showPanel?: boolean; wide?: boolean }) {
  const [t, setT] = useState(0);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setBeat((b) => {
        const len = TXS[t].addrs.length;
        if (b + 1 >= len + 1) {
          setT((x) => (x + 1) % TXS.length);
          return 0;
        }
        return b + 1;
      });
    }, 750);
    return () => clearInterval(id);
  }, [t]);

  const tx = TXS[t];
  const idle = beat >= tx.addrs.length;
  const addr = tx.addrs[Math.min(beat, tx.addrs.length - 1)];
  const SX = [175, 320, 465];
  const cyan = 'rgb(79 212 255)';
  const violet = 'rgb(143 124 255)';

  const signals: [string, string, boolean][] = [
    ['HTRANS', idle ? 'IDLE' : beat === 0 ? 'NONSEQ' : 'SEQ', !idle],
    ['HBURST', tx.burst, !idle],
    ['HADDR', idle ? '—' : hex(addr), !idle],
    ['HWRITE', tx.write ? '1 (write)' : '0 (read)', !idle],
    [tx.write ? 'HWDATA' : 'HRDATA', idle ? '—' : `D${beat}`, !idle],
    ['HREADY', '1', true],
    ['HRESP', 'OKAY', true],
  ];

  return (
    <div className={`grid gap-5 ${showPanel && wide ? 'md:grid-cols-[1.5fr_1fr]' : ''} ${className}`}>
      <svg viewBox="0 0 640 350" className="h-auto w-full" role="img" aria-label="AMBA AHB subsystem: master, shared bus, address decoder selecting one of three slaves, and a slave multiplexer returning read data">
        <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" textAnchor="middle">
          {/* master */}
          <rect x="240" y="10" width="160" height="44" rx="8" fill="rgba(79,212,255,0.08)" stroke={cyan} />
          <text x="320" y="30" fontSize="11.5" fontWeight="600" fill="#fff">AHB MASTER</text>
          <text x="320" y="45" fontSize="8.5" fill="rgba(197,203,224,0.6)">protocol FSM · burst engine</text>
          <path d="M320 54v24" stroke={cyan} strokeWidth="1.6" className="sig-fast" />

          {/* bus */}
          <rect x="30" y="78" width="580" height="22" rx="4" fill="#0e1322" stroke="rgba(130,150,200,0.35)" />
          <path d="M40 89h560" stroke={cyan} strokeWidth="2" className="sig" opacity={idle ? 0.25 : 1} />
          <text x="72" y="93" fontSize="9" fill="rgba(197,203,224,0.8)" textAnchor="start" dx="-30">AHB BUS</text>
          <text x="600" y="93" fontSize="8.5" fill="rgba(197,203,224,0.55)" textAnchor="end">HADDR · HWDATA · HTRANS · HBURST · HWRITE</text>

          {/* decoder */}
          <path d="M110 100v26" stroke="rgba(130,150,200,0.35)" strokeWidth="1.3" />
          <rect x="40" y="126" width="140" height="40" rx="8" fill="#0e1322" stroke="rgba(197,203,224,0.4)" />
          <text x="110" y="144" fontSize="10" fill="#fff">ADDRESS</text>
          <text x="110" y="157" fontSize="10" fill="#fff">DECODER</text>
          <text x="118" y="116" fontSize="8" fill="rgba(197,203,224,0.55)" textAnchor="start">HADDR</text>

          {/* control */}
          <rect x="460" y="126" width="140" height="40" rx="8" fill="#0e1322" stroke="rgba(197,203,224,0.25)" />
          <text x="530" y="151" fontSize="10" fill="rgba(255,255,255,0.85)">CONTROL</text>
          <path d="M530 100v26" stroke="rgba(130,150,200,0.35)" strokeWidth="1.3" />

          {/* HSEL + slaves */}
          {SX.map((x, i) => {
            const sel = !idle && tx.slave === i;
            return (
              <g key={i}>
                <path d={`M110 166v16h${x - 110}v28`} fill="none" stroke={sel ? cyan : 'rgba(130,150,200,0.22)'} strokeWidth={sel ? 1.8 : 1.2} className={sel ? 'sig-fast' : ''} />
                <path d={`M${x + 30} 100v110`} stroke="rgba(130,150,200,0.12)" strokeWidth="1" strokeDasharray="2 4" />
                <rect x={x - 55} y="210" width="110" height="46" rx="8" fill={sel ? 'rgba(79,212,255,0.12)' : '#0c111f'} stroke={sel ? cyan : 'rgba(130,150,200,0.35)'} style={{ transition: 'all .3s' }} />
                <text x={x} y="231" fontSize="11" fontWeight="600" fill="#fff">SLAVE {i}</text>
                <text x={x} y="246" fontSize="8" fill={sel ? cyan : 'rgba(197,203,224,0.5)'}>{sel ? 'HSEL = 1' : 'HSEL = 0'}</text>
                <path d={`M${x} 256v24L320 ${294}`} fill="none" stroke={sel ? violet : 'rgba(130,150,200,0.22)'} strokeWidth={sel ? 1.6 : 1.1} />
              </g>
            );
          })}

          {/* mux */}
          <path d="M236 294h168l-20 34h-128z" fill="#0e1322" stroke={violet} />
          <text x="320" y="315" fontSize="10" fill="#fff">SLAVE MUX</text>
          <path d="M404 311h216V32H400" fill="none" stroke="rgba(143,124,255,0.3)" strokeWidth="1.3" />
          <path d="M404 311h216V32H400" fill="none" stroke={violet} strokeWidth="1.6" className="sig" opacity={!idle && !tx.write ? 1 : 0.2} />
          <text x="626" y="200" fontSize="8.5" fill={violet} transform="rotate(90 626 200)">HRDATA · HREADY · HRESP</text>
        </g>
      </svg>

      {showPanel && (
        <div className="panel self-center p-4 font-mono text-[11.5px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="label !text-[9.5px]">example transaction</span>
            <span className="flex gap-1">
              {TXS.map((x, i) => (
                <span key={x.burst} className={`rounded px-1.5 py-0.5 text-[9.5px] ${i === t ? 'bg-signal text-ink-950' : 'text-mute'}`}>{x.burst}</span>
              ))}
            </span>
          </div>
          <dl className="divide-y divide-line">
            {signals.map(([k, v, live]) => (
              <div key={k} className="flex justify-between py-1.5">
                <dt className="text-mute">{k}</dt>
                <dd className={live ? 'text-signal' : 'text-fog/60'}>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex gap-1.5" aria-label="Burst address beats">
            {tx.addrs.map((a, i) => (
              <span key={i} className={`flex-1 rounded border py-1 text-center text-[10px] transition-colors ${i === beat ? 'border-signal bg-signal/15 text-white' : i < beat ? 'border-line text-fog/70' : 'border-line text-mute/50'}`}>
                {hex(a).slice(2)}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[9.5px] leading-relaxed text-mute/70">WRAP4 wraps at the 16-byte boundary — same rule as the master RTL. Addresses and slave map are illustrative.</p>
        </div>
      )}
    </div>
  );
}
