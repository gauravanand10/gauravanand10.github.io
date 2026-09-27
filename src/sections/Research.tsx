import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { researchTopics } from '../data/skills';

const FORMATS = [
  { n: 'FP32', parts: [[1, 's'], [8, 'exponent'], [23, 'mantissa']] },
  { n: 'FP16', parts: [[1, 's'], [5, 'exp'], [10, 'mantissa']] },
  { n: 'BF16', parts: [[1, 's'], [8, 'exponent'], [7, 'mant.']] },
  { n: 'INT8', parts: [[8, 'two’s complement']] },
] as const;
const COL: Record<string, string> = { s: 'rgb(255 95 134)', exp: 'rgb(143 124 255)', exponent: 'rgb(143 124 255)', mantissa: 'rgb(79 212 255)', 'mant.': 'rgb(79 212 255)', 'two’s complement': 'rgb(197 203 224)' };

function FormatDiagram() {
  return (
    <figure>
      <div className="space-y-3">
        {FORMATS.map((f) => (
          <div key={f.n} className="grid grid-cols-[48px_1fr] items-center gap-3">
            <span className={`font-mono text-[11px] ${f.n === 'BF16' || f.n === 'INT8' ? 'text-white' : 'text-mute'}`}>{f.n}</span>
            <div className="flex h-7 gap-[2px]" style={{ width: `${(f.parts.reduce((a, p) => a + p[0], 0) / 32) * 100}%` }}>
              {f.parts.map(([bits, name]) => (
                <div key={name} className="relative flex items-center justify-center overflow-hidden rounded-[3px] font-mono text-[9px] text-ink-950" style={{ flex: bits, background: COL[name] }} title={`${name}: ${bits} bits`}>
                  <span className="truncate px-1">{bits > 3 ? `${name} · ${bits}` : 's'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-5 text-[13.5px] leading-relaxed text-mute">
        BF16 keeps FP32&apos;s 8-bit exponent — the same dynamic range — but only 7 mantissa bits. Its 8-bit significand (with the hidden bit) is the same width as an INT8 operand, which is what makes a shared 8×8 multiplier datapath worth exploring.
      </figcaption>
    </figure>
  );
}

export default function Research() {
  return (
    <section id="research" aria-labelledby="research-title" className="relative py-28 md:py-36">
      <div className="wrap">
        <SectionHeading index="06" kicker="Research" title={<span id="research-title">Research &amp; hardware <span className="text-grad">exploration.</span></span>} lead="The questions behind the projects — mostly about how much precision, power and parallelism a datapath really needs." />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="panel p-6 sm:p-8">
            <p className="label mb-2 !text-[9.5px]">Fig. R1</p>
            <h3 className="mb-6 text-xl font-semibold tracking-tight">Number formats for inference</h3>
            <FormatDiagram />
            <div className="mt-8 border-t border-line pt-6">
              <p className="label mb-3 !text-[9.5px]">Open question</p>
              <p className="font-display text-[18px] leading-snug text-white">
                How much of an INT8 engine can a BF16 engine reuse — and what does gating the rest actually save?
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-signal">→ explored in PA-MAC</p>
            </div>
          </Reveal>
          <ol className="grid content-start gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {researchTopics.map((t, i) => (
              <Reveal key={t.t} delay={i * 0.04} className={`${i === researchTopics.length - 1 && researchTopics.length % 2 ? 'sm:col-span-2' : ''} bg-ink-900/95 p-5 transition-colors hover:bg-ink-850`}>
                <li className="list-none">
                  <p className="font-mono text-[10px] text-signal">R.{String(i + 1).padStart(2, '0')}</p>
                  <p className="mt-2 font-display text-[16.5px] font-semibold text-white">{t.t}</p>
                  <p className="mt-1 text-[13px] leading-snug text-mute">{t.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
