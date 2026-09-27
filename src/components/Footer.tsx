import { profile, asset } from '../data/profile';

export default function Footer() {
  const resume = profile.resume.available ? asset(profile.resume.path) : '/#resume';
  return (
    <footer className="relative z-10 border-t border-line bg-ink-950/80">
      <div className="wrap flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-white">GAURAV ANAND</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">VLSI • ASIC • FPGA • Digital Hardware • Embedded</p>
          <p className="mt-5 font-mono text-[13px] text-signal">// Designed in RTL. Built in hardware.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.14em]">
          <a className="text-fog hover:text-signal" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="text-fog hover:text-signal" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="text-fog hover:text-signal" href={profile.links.email}>Email</a>
          <a className="text-fog hover:text-signal" href={resume}>Resume</a>
        </nav>
      </div>
      <div className="wrap flex flex-col justify-between gap-2 border-t border-line py-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute/70 sm:flex-row">
        <span>© {new Date().getFullYear()} Gaurav Anand</span>
        <span>Built with React · TypeScript · Tailwind · Framer Motion</span>
      </div>
    </footer>
  );
}
