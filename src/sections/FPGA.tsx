import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import FPGAFabric from '../visuals/FPGAFabric';

const PLATFORMS = [
  { n: 'PYNQ-Z2', d: 'Zynq-7000 · Python-driven overlays' },
  { n: 'Zybo', d: 'Zynq-7000 · ARM + fabric' },
  { n: 'KC705', d: 'Kintex-7 evaluation platform' },
  { n: 'ZCU104', d: 'Zynq UltraScale+ MPSoC' },
];

export default function FPGA() {
  return (
    <section id="fpga" aria-labelledby="fpga-title" className="relative py-28 md:py-36">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading index="04" kicker="FPGA" title={<span id="fpga-title">FPGA / hardware <span className="text-grad">acceleration.</span></span>} lead="Taking accelerator RTL onto programmable fabric — Zynq SoCs, AXI interfaces and the Vivado / Vitis toolchain." />
          <Reveal className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((p) => (
              <div key={p.n} className="panel group p-4 transition-colors hover:border-signal/40">
                <p className="font-display text-lg font-semibold text-white">{p.n}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-mute">{p.d}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-1.5">
            {['Vivado', 'Vitis', 'Verilog', 'SystemVerilog', 'AXI', 'Zynq'].map((t) => <span key={t} className="chip">{t}</span>)}
          </Reveal>
          <Reveal delay={0.15}>
            <Link to="/projects/sobel-systolic-accelerator#fpga" className="group mt-6 block border-l border-signal/50 pl-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">Deployed · Zybo-7000</span>
              <span className="mt-1 block text-[14.5px] leading-relaxed text-fog group-hover:text-white">The Sobel systolic accelerator runs on a Zybo-7000 over a 640×480 grayscale image, with the output reconstructed in MATLAB →</span>
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="panel p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute">
            <span><span className="text-signal">fabric</span> · hover to configure</span>
            <span className="flex gap-3">
              <span className="text-signal">■ CLB</span><span className="text-volt">■ BRAM</span><span className="text-spark">■ DSP</span>
            </span>
          </div>
          <FPGAFabric />
        </Reveal>
      </div>
    </section>
  );
}
