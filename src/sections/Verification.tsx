import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import FlowChain from '../components/FlowChain';

const EVIDENCE = [
  { k: 'Golden model', v: 'Python → C → RV32IM on Spike', to: '/projects/sobel-systolic-accelerator#verification', tool: 'Spike' },
  { k: 'Formal equivalence', v: 'RTL ≡ netlist · all checks pass', to: '/projects/sobel-systolic-accelerator#lec', tool: 'Conformal LEC' },
  { k: 'ATPG', v: '99.94 % test coverage · 23 patterns', to: '/projects/sobel-systolic-accelerator#dft', tool: 'Modus' },
  { k: 'Protocol sim', v: 'SINGLE / INCR4 / WRAP4 waveforms', to: '/projects/amba-ahb#verification', tool: 'VCS · Verdi' },
  { k: 'RTL lint', v: 'Lint, clock-reset, STARC rules', to: '/projects/amba-ahb#spyglass', tool: 'SpyGlass' },
  { k: 'Coverage', v: 'Functional coverage with UVM — next step', to: '/projects/amba-ahb#next', tool: 'planned' },
];

function Waveform() {
  const clk = Array.from({ length: 16 }, (_, i) => `h14v${i % 2 ? 18 : -18}`).join('');
  return (
    <svg viewBox="0 0 300 150" className="mx-auto h-auto max-h-[230px] w-full" role="img" aria-label="Stylised digital waveform showing clock, valid and data signals">
      <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="8" fill="rgba(197,203,224,0.6)">
        <text x="0" y="24">clk</text>
        <text x="0" y="64">valid</text>
        <text x="0" y="104">data</text>
        <text x="0" y="140">ready</text>
      </g>
      <g fill="none" strokeWidth="1.4">
        <path d={`M40 30${clk}`} stroke="rgb(79 212 255)" />
        <path d="M40 70h56v-18h112v18h60" stroke="rgb(143 124 255)" />
        <path d="M40 100h56l4-8h32l4 8-4 8h-32l-4-8m40 0 4-8h24l4 8-4 8h-24l-4-8m32 0 4-8h24l4 8-4 8h-24m28-8h60" stroke="rgb(255 95 134)" />
        <path d="M40 136h56v-12h170" stroke="rgba(197,203,224,0.6)" />
      </g>
      <g className="sig-slow" stroke="rgba(255,255,255,0.4)" strokeWidth="1">
        <path d="M150 8v140" strokeDasharray="2 4" />
      </g>
      <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fontSize="7.5" fill="#fff">
        <text x="112" y="103">D0</text><text x="148" y="103">D1</text><text x="180" y="103">D2</text>
      </g>
    </svg>
  );
}

export default function Verification() {
  return (
    <section id="verification" aria-labelledby="verif-title" className="relative py-28 md:py-36">
      <div className="wrap">
        <SectionHeading index="05" kicker="Verification" title={<span id="verif-title">Design is only <span className="text-grad">half the job.</span></span>} lead="Every block is checked more than one way — by simulation, by a software golden model, by lint, by formal equivalence and by manufacturing-test coverage." />
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <Reveal className="panel p-5">
            <p className="label mb-4 !text-[9.5px]">verification loop</p>
            <FlowChain steps={['RTL', 'Testbench', 'Simulation', 'Waveform', 'Lint', 'Coverage', 'Synthesis']} highlight={[0, 6]} />
          </Reveal>
          <div className="grid gap-5">
            <Reveal className="panel p-5 sm:p-6">
              <div className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                <span><span className="text-signal">wave</span> · illustrative</span>
                <span>real waveforms in each case study</span>
              </div>
              <Waveform />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {EVIDENCE.map((e, i) => (
                <Reveal key={e.k} delay={i * 0.05}>
                  <Link to={e.to} className="panel group block h-full p-5 transition-colors hover:border-signal/40">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">{e.tool}</p>
                    <p className="mt-2 font-display text-lg font-semibold text-white">{e.k}</p>
                    <p className="mt-1 text-[13.5px] leading-snug text-mute">{e.v}</p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-mute/70 transition-colors group-hover:text-signal">see evidence →</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
