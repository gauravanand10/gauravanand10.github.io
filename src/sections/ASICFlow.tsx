import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

type Stage = { k: string; tools: string[]; what: string; evidence?: { label: string; to: string }[]; status: 'done' | 'in-progress' | 'learning' };

const STAGES: Stage[] = [
  { k: 'RTL', tools: ['Verilog', 'SystemVerilog'], what: 'Synthesizable architecture: datapaths, FSMs, bus interfaces.', status: 'done', evidence: [{ label: 'Sobel accelerator', to: '/projects/sobel-systolic-accelerator#rtl' }, { label: 'AMBA-AHB', to: '/projects/amba-ahb#fsm' }] },
  { k: 'Simulation', tools: ['Synopsys VCS'], what: 'Directed testbenches per module and at top level.', status: 'done', evidence: [{ label: 'AHB · VCS', to: '/projects/amba-ahb#verification' }] },
  { k: 'Verification', tools: ['Verdi', 'Spike', 'Conformal'], what: 'Waveform debug, golden-model comparison, formal equivalence.', status: 'done', evidence: [{ label: 'Sobel · golden model + LEC', to: '/projects/sobel-systolic-accelerator#verification' }] },
  { k: 'Synthesis', tools: ['Cadence Genus', 'Design Compiler'], what: 'RTL → gate-level netlist on a 180 nm standard-cell library.', status: 'done', evidence: [{ label: 'Sobel · Genus', to: '/projects/sobel-systolic-accelerator#synthesis' }, { label: 'AHB · DC', to: '/projects/amba-ahb#synthesis' }] },
  { k: 'DFT', tools: ['Genus DFT', 'Cadence Modus'], what: 'Scan insertion, ATPG, fault coverage.', status: 'done', evidence: [{ label: 'Sobel · 99.94 % coverage', to: '/projects/sobel-systolic-accelerator#dft' }] },
  { k: 'STA', tools: ['Genus', 'Design Compiler'], what: 'Setup / hold analysis against SDC constraints.', status: 'done', evidence: [{ label: 'Sobel · +6.522 ns', to: '/projects/sobel-systolic-accelerator#synthesis' }] },
  { k: 'Floorplan', tools: ['Cadence Innovus'], what: 'Die / core sizing, macro and power-domain placement.', status: 'in-progress', evidence: [{ label: 'PA-MAC', to: '/projects/pa-mac#pnr' }] },
  { k: 'Placement', tools: ['Cadence Innovus'], what: 'Standard-cell placement and optimisation.', status: 'in-progress', evidence: [{ label: 'PA-MAC', to: '/projects/pa-mac#pnr' }] },
  { k: 'CTS', tools: ['Cadence Innovus'], what: 'Clock-tree synthesis — skew and insertion delay.', status: 'in-progress', evidence: [{ label: 'PA-MAC', to: '/projects/pa-mac#pnr' }] },
  { k: 'Routing', tools: ['Cadence Innovus'], what: 'Global and detailed routing, post-route timing.', status: 'in-progress', evidence: [{ label: 'PA-MAC', to: '/projects/pa-mac#pnr' }] },
  { k: 'DRC / LVS', tools: ['Signoff'], what: 'Physical verification against design rules and schematic.', status: 'learning' },
  { k: 'GDSII', tools: ['Stream-out'], what: 'Final layout database. No tapeout claimed.', status: 'learning' },
];

const STATUS = {
  done: { t: 'published in repo', c: 'text-signal border-signal/40 bg-signal/10' },
  'in-progress': { t: 'in progress', c: 'text-volt border-volt/40 bg-volt/10' },
  learning: { t: 'learning', c: 'text-mute border-white/15 bg-white/[0.03]' },
};

export default function ASICFlow() {
  const [sel, setSel] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSel((s) => (s + 1) % STAGES.length), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const s = STAGES[sel];

  return (
    <section id="asic" aria-labelledby="asic-title" className="relative py-28 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_30%,rgba(79,212,255,0.06),transparent_70%)]" />
      <div className="wrap relative">
        <SectionHeading index="03" kicker="ASIC" title={<span id="asic-title">From RTL <span className="text-grad">to silicon.</span></span>} lead="The flow I work through, stage by stage — and where each stage shows up in my repositories. Stages without published evidence are labelled as such." />

        <Reveal>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute">
              <span><span className="text-signal">asic_flow</span> / stage {String(sel + 1).padStart(2, '0')} of {STAGES.length}</span>
              <span className="hidden sm:inline">click a stage</span>
            </div>

            {/* pipeline */}
            <div className="relative px-4 pb-6 pt-8 sm:px-6">
              <div className="relative grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-12 lg:gap-1.5">
                <div aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px bg-line lg:block" />
                <motion.div aria-hidden className="absolute top-[21px] hidden h-[3px] rounded-full bg-gradient-to-r from-signal to-volt lg:block" animate={{ width: `${((sel + 0.5) / STAGES.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} style={{ left: 0 }} />
                {STAGES.map((st, i) => (
                  <button
                    key={st.k}
                    onClick={() => { setSel(i); setAuto(false); }}
                    aria-pressed={sel === i}
                    className="group relative flex flex-col items-center gap-2 rounded-lg px-1 py-1 text-center"
                  >
                    <span className={`relative z-10 grid h-11 w-11 place-items-center rounded-lg border font-mono text-[11px] transition-all duration-300 ${sel === i ? 'scale-110 border-signal bg-signal text-ink-950 shadow-[0_0_24px_rgba(79,212,255,0.5)]' : i < sel ? 'border-signal/40 bg-ink-800 text-signal' : 'border-line bg-ink-850 text-mute group-hover:border-white/30'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-mono text-[10px] uppercase leading-tight tracking-[0.06em] ${sel === i ? 'text-white' : 'text-mute'}`}>{st.k}</span>
                    <span className={`h-1 w-1 rounded-full ${st.status === 'done' ? 'bg-signal' : st.status === 'in-progress' ? 'bg-volt' : 'bg-white/20'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* detail */}
            <div className="grid border-t border-line md:grid-cols-[1.2fr_1fr]">
              <AnimatePresence mode="wait">
                <motion.div key={s.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.k}</h3>
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] ${STATUS[s.status].c}`}>{STATUS[s.status].t}</span>
                  </div>
                  <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-mute">{s.what}</p>
                  {s.evidence && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.evidence.map((e) => (
                        <Link key={e.label} to={e.to} className="chip !border-signal/30 !py-1.5 !text-signal hover:!bg-signal/10">↳ {e.label}</Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="border-t border-line p-6 sm:p-8 md:border-l md:border-t-0">
                <p className="label mb-4 !text-[9.5px]">toolchain</p>
                <ul className="grid grid-cols-2 gap-2">
                  {['Cadence Genus', 'Cadence Innovus', 'Cadence Modus', 'Cadence Conformal', 'Synopsys VCS', 'Verdi', 'SpyGlass', 'Design Compiler'].map((t) => (
                    <li key={t} className={`rounded-lg border px-3 py-2 font-mono text-[11px] transition-colors ${s.tools.some((x) => t.includes(x.replace('Cadence ', '')) || x.includes(t)) ? 'border-signal/50 bg-signal/10 text-white' : 'border-line text-mute'}`}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
