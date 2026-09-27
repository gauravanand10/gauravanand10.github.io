import { techMarquee } from '../data/profile';

export default function TechMarquee() {
  const row = [...techMarquee, ...techMarquee];
  return (
    <section id="marquee" aria-label="Technologies" className="marquee relative border-y border-line bg-ink-900/60 py-5 backdrop-blur-sm">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="marquee-track flex w-max items-center">
          {row.map((t, i) => (
            <li key={i} aria-hidden={i >= techMarquee.length} className="flex items-center font-mono text-[13px] uppercase tracking-[0.22em] text-fog/80">
              <span className="px-6 transition-colors hover:text-signal">{t}</span>
              <span className="text-signal/70">•</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
