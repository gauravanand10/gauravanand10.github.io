import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { profile } from '../data/profile';

const STAGES = [
  { k: 'Digital logic', d: 'Combinational & sequential fundamentals' },
  { k: 'RTL design', d: 'Verilog / SystemVerilog, FSMs, datapaths' },
  { k: 'Verification', d: 'Testbenches, VCS, Verdi, golden models' },
  { k: 'Synthesis', d: 'Genus, Design Compiler, LEC, DFT' },
  { k: 'FPGA / ASIC', d: 'Implementation on fabric or silicon flow' },
  { k: 'Real hardware', d: 'ESP32 systems, sensors, motors, robots' },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-36">
      <div className="wrap grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading index="01" kicker="About" title={<span id="about-title">Engineering with <span className="text-grad">hardware</span> in mind.</span>} />
          <Reveal className="space-y-5 text-[17px] leading-relaxed text-mute">
            <p>
              I&apos;m an electronics engineering student — <span className="text-fog">{profile.education.degree.replace('B.Tech — ', 'B.Tech in ')}</span> at{' '}
              <span className="text-fog">{profile.education.school}</span> — focused on digital hardware design, VLSI, FPGA acceleration, hardware architecture and embedded systems.
            </p>
            <p>
              My work spans RTL design, protocol implementation, verification, synthesis, ASIC-oriented design, FPGA acceleration and real-world embedded hardware. I like projects where the same idea has to survive both a timing report and a
              motor spinning up on a bench.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ['Design', 'RTL · datapaths · protocols'],
              ['Verify', 'testbench · lint · LEC'],
              ['Build', 'synthesis · DFT · boards'],
            ].map(([a, b]) => (
              <div key={a} className="panel px-4 py-4">
                <p className="font-display text-lg font-semibold text-white">{a}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">{b}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative lg:pt-8">
          <p className="label mb-6">abstraction stack ↓</p>
          <ol className="relative">
            <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-signal/60 via-volt/40 to-signal/10" />
            {STAGES.map((s, i) => (
              <motion.li
                key={s.k}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative flex items-start gap-5 py-3"
              >
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-ink-850 font-mono text-[11px] text-signal transition-colors group-hover:border-signal/60">
                  {String(i).padStart(2, '0')}
                </span>
                <div className="flex-1 border-b border-line pb-3">
                  <p className="font-display text-[19px] font-semibold uppercase tracking-tight text-white">{s.k}</p>
                  <p className="mt-0.5 text-[14px] text-mute">{s.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
