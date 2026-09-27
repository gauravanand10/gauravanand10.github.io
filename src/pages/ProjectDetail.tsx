import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, projects, type DetailSection } from '../data/projects';
import ProjectVisual from '../visuals/ProjectVisual';
import LiveSobel from '../visuals/LiveSobel';
import FlowChain from '../components/FlowChain';
import Figure from '../components/Figure';
import Reveal from '../components/Reveal';
import Tags from '../components/Tags';
import NotFound from './NotFound';
import { Highlights } from '../components/ProjectCard';
import { Arrow, ArrowUpRight, GitHubIcon } from '../components/Icons';

const STORY = ['problem', 'architecture', 'implementation', 'verification', 'result'] as const;

function Section({ s, i, repo }: { s: DetailSection; i: number; repo: string | null }) {
  return (
    <Reveal>
      <section id={s.id} aria-labelledby={`h-${s.id}`} className="scroll-mt-28 border-t border-line py-12 first:border-t-0 first:pt-0">
        <p className="font-mono text-[10.5px] text-signal">§{String(i + 1).padStart(2, '0')}</p>
        <h2 id={`h-${s.id}`} className="mt-2 text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-tight">{s.title}</h2>
        <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-mute">
          {s.body?.map((b, k) => <p key={k}>{b}</p>)}
        </div>
        {s.bullets && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-3 rounded-lg border border-line bg-ink-900/60 px-4 py-3 text-[14.5px] text-fog">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />{b}
              </li>
            ))}
          </ul>
        )}
        {s.flow && <FlowChain steps={s.flow} horizontal className="mt-6" />}
        {s.code && (
          <pre className="mt-6 overflow-x-auto rounded-xl border border-line bg-ink-950/80 p-5 font-mono text-[13px] leading-6 text-fog"><code>{s.code}</code></pre>
        )}
        {s.metrics && (
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
            {s.metrics.map((m) => (
              <div key={m.label} className="bg-ink-900/95 p-4">
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-mute">{m.label}</dt>
                <dd className="mt-1.5 font-display text-[19px] font-semibold text-white">{m.value}</dd>
                {m.note && <dd className="mt-0.5 font-mono text-[9.5px] leading-snug text-mute/80">{m.note}</dd>}
              </div>
            ))}
          </dl>
        )}
        {s.table && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[420px] text-left text-[14px]">
              <thead className="bg-ink-850 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
                <tr>{s.table.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-line">
                {s.table.rows.map((r) => (
                  <tr key={r.join()} className="bg-ink-900/60">
                    {r.map((c, k) => <td key={k} className={`px-4 py-3 ${k === 0 ? 'font-mono text-[12.5px] text-signal' : 'text-fog/90'}`}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {s.figures && (
          <div className={`mt-6 grid gap-5 ${s.figures.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {s.figures.map((f) => <Figure key={f.src} f={f} repo={repo} />)}
          </div>
        )}
        {s.placeholder && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.015] px-5 py-4 font-mono text-[12px] text-mute">
            <span className="h-2 w-2 shrink-0 rounded-full bg-volt/70 pulse" />
            {s.placeholder}
          </div>
        )}
      </section>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!p) return;
    document.title = `${p.title} — ${p.subtitle} | Gaurav Anand`;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    p.sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => { io.disconnect(); document.title = 'Gaurav Anand | VLSI • ASIC • FPGA • Digital Hardware'; };
  }, [p]);

  if (!p) return <NotFound />;
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];

  return (
    <article className="pb-24 pt-28 md:pt-36">
      <header className="wrap">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          <Link to="/#projects" className="hover:text-signal">← Projects</Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-signal">{p.number}</span>
        </nav>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{p.number} · {p.category.join(' · ')}</p>
            <h1 className={`mt-4 font-extrabold leading-[0.92] tracking-tightest ${p.featured ? 'text-[clamp(3.5rem,10vw,7rem)]' : 'text-[clamp(2.4rem,6vw,4.4rem)]'}`}>
              {p.featured ? <span className="text-grad">{p.title}</span> : p.title}
            </h1>
            <p className="mt-4 font-display text-[clamp(1.15rem,2.4vw,1.6rem)] text-white/90">{p.subtitle}</p>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-mute">{p.description}</p>
            <Tags items={p.tags} className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              {p.repo ? (
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn-primary"><GitHubIcon /> View code <ArrowUpRight /></a>
              ) : (
                <span className="chip !px-4 !py-3 !text-mute">Repository coming soon</span>
              )}
            </div>
          </div>
          <div className="panel p-4 sm:p-6">
            <ProjectVisual k={p.visual} />
            {p.visual === 'systolic' && <div className="mt-6 border-t border-line pt-6"><LiveSobel /></div>}
          </div>
        </div>

        <ol className="mt-14 grid overflow-hidden rounded-2xl border border-line sm:grid-cols-2 lg:grid-cols-6">
          {STORY.map((k, i) => (
            <li key={k} className="border-b border-line bg-ink-900/70 p-5 sm:border-r lg:border-b-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{String(i + 1).padStart(2, '0')} · {k}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-fog/85">{p.story[k]}</p>
            </li>
          ))}
          <li className="bg-ink-900/70 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-volt">06 · code</p>
            {p.repo ? (
              <a className="mt-2 block break-all font-mono text-[12px] text-fog hover:text-signal" href={p.repo} target="_blank" rel="noreferrer">{p.repo.replace('https://github.com/', '')} ↗</a>
            ) : (
              <p className="mt-2 text-[13.5px] text-mute">Repository will be linked when public.</p>
            )}
          </li>
        </ol>

        <div className="mt-8">
          <Highlights p={p} />
          {p.highlightsNote && <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute/70">{p.highlightsNote}</p>}
        </div>
      </header>

      <div className="wrap mt-20 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="label mb-4 !text-[9.5px]">On this page</p>
            <ol className="space-y-1 border-l border-line">
              {p.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`-ml-px block border-l py-1.5 pl-4 text-[13px] transition-colors ${active === s.id ? 'border-signal text-white' : 'border-transparent text-mute hover:text-fog'}`}>
                    <span className="mr-2 font-mono text-[10px] text-mute/70">{String(i + 1).padStart(2, '0')}</span>{s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="min-w-0 max-w-3xl">
          {p.sections.map((s, i) => <Section key={s.id} s={s} i={i} repo={p.repo} />)}
          {p.repo && (
            <section id="github" className="border-t border-line py-12">
              <p className="font-mono text-[10.5px] text-signal">§{String(p.sections.length + 1).padStart(2, '0')}</p>
              <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-tight">GitHub</h2>
              <p className="mt-4 text-mute">RTL / firmware, testbenches and reports are all in the repository.</p>
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn-primary mt-6"><GitHubIcon /> Open repository <ArrowUpRight /></a>
            </section>
          )}
        </div>
      </div>

      <nav aria-label="More projects" className="wrap mt-16 grid gap-4 sm:grid-cols-2">
        {[prev, next].map((q, i) => (
          <Link key={q.slug} to={`/projects/${q.slug}`} className={`panel group flex items-center justify-between gap-4 p-6 transition-colors hover:border-signal/40 ${i ? 'sm:text-right' : ''}`}>
            {i === 0 && <Arrow className="h-4 w-4 rotate-180 text-mute group-hover:text-signal" />}
            <div className={`min-w-0 flex-1 ${i ? 'sm:order-none' : ''}`}>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{i ? 'Next' : 'Previous'} · {q.number}</p>
              <p className="mt-1 truncate font-display text-xl font-semibold text-white">{q.title}</p>
            </div>
            {i === 1 && <Arrow className="h-4 w-4 text-mute group-hover:text-signal" />}
          </Link>
        ))}
      </nav>
    </article>
  );
}
