import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import TiltCard from './TiltCard';
import Tags from './Tags';
import Reveal from './Reveal';
import ProjectVisual from '../visuals/ProjectVisual';
import { Arrow, ArrowUpRight, GitHubIcon } from './Icons';

type Layout = 'split' | 'split-rev' | 'stack';

export function ProjectMeta({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.16em]">
      <span className="text-signal">{p.number}</span>
      <span className="h-px w-6 bg-white/20" />
      <span className="text-mute">{p.category.join(' · ')}</span>
    </div>
  );
}

export function Highlights({ p, n = 4 }: { p: Project; n?: number }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
      {p.highlights.slice(0, n).map((h) => (
        <div key={h.label} className="bg-ink-900/95 px-3.5 py-3">
          <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-mute">{h.label}</dt>
          <dd className="mt-1 font-display text-[17px] font-semibold leading-tight text-white">{h.value}</dd>
          {h.note && <dd className="mt-0.5 font-mono text-[9.5px] text-mute/80">{h.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Link to={`/projects/${p.slug}`} className="btn-primary !py-2.5" aria-label={`Explore ${p.title} case study`}>
        Case study <Arrow />
      </Link>
      {p.repo ? (
        <a href={p.repo} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5" aria-label={`${p.title} source on GitHub`}>
          <GitHubIcon /> Code <ArrowUpRight />
        </a>
      ) : (
        <span className="chip !py-2 !text-mute">repo · coming soon</span>
      )}
    </div>
  );
}

export default function ProjectCard({ p, layout = 'stack', className = '', extra }: { p: Project; layout?: Layout; className?: string; extra?: React.ReactNode }) {
  const split = layout !== 'stack';
  return (
    <Reveal className={className}>
      <TiltCard className="h-full" max={split ? 1.5 : 3}>
        <article className={`grid h-full ${split ? 'lg:grid-cols-2' : ''}`} aria-labelledby={`p-${p.slug}`}>
          <div className={`relative border-line bg-ink-950/40 p-5 sm:p-7 ${split ? `lg:border-0 ${layout === 'split-rev' ? 'lg:order-2 lg:border-l' : 'lg:border-r'} border-b lg:border-b-0` : 'border-b'}`}>
            <div className="flex h-full flex-col justify-center gap-5">
              <ProjectVisual k={p.visual} compact={!split} />
              {extra}
            </div>
          </div>
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <ProjectMeta p={p} />
            <div>
              <h3 id={`p-${p.slug}`} className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.05] tracking-tight">{p.title}</h3>
              <p className="mt-1.5 font-display text-[16px] text-fog/80">{p.subtitle}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-mute">{p.description}</p>
            <div className="grid gap-2 border-l border-signal/40 pl-4 text-[13.5px] leading-relaxed">
              <p><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">Problem </span><span className="text-fog/85">{p.story.problem}</span></p>
              <p><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt">Result </span><span className="text-fog/85">{p.story.result}</span></p>
            </div>
            {split && <Highlights p={p} />}
            <Tags items={p.tags} max={split ? 10 : 6} />
            <div className="mt-auto pt-1">
              <ProjectLinks p={p} />
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}
