import Reveal from '../components/Reveal';
import { profile, asset } from '../data/profile';
import { DocIcon, ArrowUpRight } from '../components/Icons';

export default function Resume() {
  const { available, path, fileName } = profile.resume;
  const { education: ed, internship: it, now } = profile;
  const rows = [
    { k: 'Education', t: ed.degree.replace('B.Tech — ', 'B.Tech in '), s: ed.school, p: ed.period, extra: `CGPA ${ed.cgpa} · ${ed.coursework.join(' · ')}` },
    { k: 'Currently building', t: now.title, s: now.note, p: now.period },
    { k: 'Internship', t: `${it.role} · ${it.org}`, s: it.note, p: it.period },
  ];
  return (
    <section id="resume" aria-labelledby="resume-title" className="relative py-16 md:py-24">
      <div className="wrap">
        <Reveal className="panel overflow-hidden">
          <div className="flex flex-col gap-8 p-6 sm:p-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label mb-3">08 · Resume</p>
              <h2 id="resume-title" className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tightest">Engineering profile.</h2>
              <p className="mt-3 max-w-lg text-[15.5px] text-mute">RTL design, verification and ASIC front-end, with FPGA deployment and embedded builds on the side.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {available ? (
                <>
                  <a className="btn-primary" href={asset(path)} target="_blank" rel="noreferrer"><DocIcon /> View resume <ArrowUpRight /></a>
                  <a className="btn-ghost" href={asset(path)} download={fileName}>Download PDF</a>
                </>
              ) : (
                <span className="btn-ghost cursor-not-allowed opacity-50" aria-disabled="true"><DocIcon /> Resume coming soon</span>
              )}
            </div>
          </div>
          <dl className="grid border-t border-line md:grid-cols-3">
            {rows.map((r, i) => (
              <div key={r.k} className={`p-6 sm:p-8 ${i ? 'border-t border-line md:border-l md:border-t-0' : ''}`}>
                <dt className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="text-signal">{r.k}</span>
                  <span className="text-mute">{r.p}</span>
                </dt>
                <dd className="mt-3 font-display text-[17px] font-semibold leading-snug text-white">{r.t}</dd>
                <dd className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{r.s}</dd>
                {r.extra && <dd className="mt-3 font-mono text-[10.5px] leading-relaxed text-fog/70">{r.extra}</dd>}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
