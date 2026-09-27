import { projects } from '../data/projects';
import { moreRepos, profile } from '../data/profile';
import Reveal from '../components/Reveal';
import { ArrowUpRight, GitHubIcon } from '../components/Icons';

export default function GitHubSection() {
  const repos = [
    ...projects.filter((p) => p.repo).map((p) => ({ name: p.repo!.split('/').pop()!, note: p.subtitle, lang: p.domain === 'silicon' ? 'Verilog' : p.slug === 'esp32-cam-tof' ? 'C' : 'C++' })),
    ...moreRepos,
  ];
  return (
    <section id="github" aria-labelledby="gh-title" className="relative py-28 md:py-36">
      <div className="wrap">
        <Reveal className="relative overflow-hidden rounded-[28px] border border-line bg-ink-900/80 p-6 sm:p-10 lg:p-14">
          <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-volt/10 blur-3xl" />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="label mb-5 flex items-center gap-2"><GitHubIcon className="h-3.5 w-3.5" /> github.com/gauravanand10</p>
              <h2 id="gh-title" className="text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.95] tracking-tightest">
                The code<br />is <span className="text-grad">open.</span>
              </h2>
              <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-mute">Explore the RTL, firmware, synthesis reports, hardware experiments and engineering work behind the projects.</p>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-primary mt-8">View GitHub <ArrowUpRight /></a>
              <figure className="mt-10 overflow-hidden rounded-xl border border-line bg-ink-950/60 p-3">
                <img
                  src="https://raw.githubusercontent.com/gauravanand10/gauravanand10/output/github-contribution-grid-snake-dark.svg"
                  alt="Live contribution graph from GitHub"
                  loading="lazy"
                  className="w-full"
                  onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
                />
                <figcaption className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-mute/70">live from github · contribution snake</figcaption>
              </figure>
            </div>
            <ul className="grid content-start gap-2">
              {repos.map((r, i) => (
                <li key={r.name}>
                  <a href={`${profile.links.github}/${r.name}`} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-xl border border-line bg-ink-950/40 px-4 py-3.5 transition-all hover:border-signal/40 hover:bg-ink-850">
                    <span className="font-mono text-[10px] text-mute">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[13px] text-white group-hover:text-signal">{r.name}</span>
                      <span className="block truncate text-[12.5px] text-mute">{r.note}</span>
                    </span>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-mute sm:inline">{r.lang}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
