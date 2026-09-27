import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { skillGroups } from '../data/skills';

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-28 md:py-32">
      <div className="wrap">
        <SectionHeading index="07" kicker="Toolbox" title={<span id="skills-title">What I work <span className="text-grad">with.</span></span>} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.06} className={`panel p-6 lg:col-span-2`}>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[19px] font-semibold tracking-tight">{g.title}</h3>
                <span className="rounded border border-signal/30 px-1.5 py-0.5 font-mono text-[9.5px] text-signal">{g.code}</span>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <li key={s} className="rounded-md border border-line bg-ink-850 px-2.5 py-1.5 font-mono text-[11.5px] text-fog/90 transition-colors hover:border-signal/50 hover:text-white">{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
