import type { Project } from '../data/projects';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import Tags from './Tags';
import PAMACDatapath from '../visuals/PAMACDatapath';
import { Highlights, ProjectLinks } from './ProjectCard';

const STORY = ['problem', 'architecture', 'implementation', 'verification', 'result'] as const;

export default function FeaturedProject({ p }: { p: Project }) {
  return (
    <Reveal>
      <TiltCard max={1} className="border-signal/20 shadow-[0_40px_120px_-40px_rgba(79,212,255,0.25)]">
        <article aria-labelledby="featured-title" className="relative">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 font-mono text-[10.5px] uppercase tracking-[0.18em] sm:px-10">
            <span className="flex items-center gap-3">
              <span className="text-signal">{p.number} / Flagship project</span>
            </span>
            <span className="text-mute">{p.category.join(' • ')}</span>
          </header>

          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <div>
                <h3 id="featured-title" className="text-[clamp(3.4rem,9vw,6.5rem)] font-extrabold leading-[0.85] tracking-tightest">
                  <span className="text-grad">{p.title}</span>
                </h3>
                <p className="mt-4 font-display text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-white">
                  Precision-Adaptive INT8/BF16<br className="hidden sm:block" /> Dot-Product Engine
                </p>
              </div>
              <p className="text-[16px] leading-relaxed text-mute">{p.description}</p>

              <div className="panel p-4">
                <p className="label mb-3 !text-[9.5px]">Processing element</p>
                <pre className="font-mono text-[12.5px] leading-6 text-fog">
{`PE
 ├── `}<span className="text-signal">8×8 multipliers</span>{`
 ├── `}<span className="text-signal">DP4</span>{`
 └── `}<span className="text-spark">accumulator</span>
                </pre>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['PD_AON', 'PD_CORE', 'PD_FPU', 'PD_ACC'].map((d, i) => (
                    <span key={d} className="chip" style={{ borderColor: ['rgba(197,203,224,.3)', 'rgba(79,212,255,.45)', 'rgba(143,124,255,.5)', 'rgba(255,95,134,.45)'][i] }}>{d}</span>
                  ))}
                </div>
              </div>

              <Tags items={p.tags} />
              <ProjectLinks p={p} />
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-line bg-ink-950/50 p-4 sm:p-6">
                <PAMACDatapath />
              </div>
              <Highlights p={p} />
              {p.highlightsNote && <p className="-mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mute/70">{p.highlightsNote}</p>}
            </div>
          </div>

          <ol className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-5">
            {STORY.map((k, i) => (
              <li key={k} className={`border-line p-5 sm:p-6 ${i ? 'border-t sm:border-t-0' : ''} ${i % 2 ? 'sm:border-l' : ''} lg:border-l lg:first:border-l-0 ${i >= 2 ? 'sm:border-t lg:border-t-0' : ''}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{String(i + 1).padStart(2, '0')} · {k}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-fog/85">{p.story[k]}</p>
              </li>
            ))}
          </ol>
        </article>
      </TiltCard>
    </Reveal>
  );
}
