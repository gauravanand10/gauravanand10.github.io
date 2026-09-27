import Reveal from '../components/Reveal';
import { profile, asset } from '../data/profile';
import { GitHubIcon, LinkedInIcon, MailIcon, DocIcon, ArrowUpRight } from '../components/Icons';

export default function Contact() {
  const links = [
    { l: 'GitHub', h: profile.links.github, i: <GitHubIcon className="h-5 w-5" />, s: 'gauravanand10', ext: true },
    { l: 'LinkedIn', h: profile.links.linkedin, i: <LinkedInIcon className="h-5 w-5" />, s: 'gaurav-anand', ext: true },
    { l: 'Email', h: profile.links.email, i: <MailIcon className="h-5 w-5" />, s: profile.links.emailPlain, ext: false },
    { l: 'Resume', h: profile.resume.available ? asset(profile.resume.path) : '#resume', i: <DocIcon className="h-5 w-5" />, s: profile.resume.available ? 'PDF' : 'coming soon', ext: profile.resume.available },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_60%,rgba(79,212,255,0.08),transparent_70%)]" />
      <div className="wrap relative text-center">
        <Reveal>
          <p className="label mb-6">09 · Contact</p>
          <h2 id="contact-title" className="text-[clamp(3rem,10vw,7.5rem)] font-extrabold leading-[0.9] tracking-tightest">
            Let&apos;s build<br /><span className="text-grad">something.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-mute">Interested in VLSI, digital hardware, ASIC design, FPGA acceleration or embedded systems? I&apos;m open to internships, research and collaboration.</p>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((x) => (
            <a key={x.l} href={x.h} {...(x.ext ? { target: '_blank', rel: 'noreferrer' } : {})} className="panel group flex flex-col items-start gap-6 p-5 text-left transition-all hover:-translate-y-1 hover:border-signal/40">
              <span className="flex w-full items-center justify-between text-fog group-hover:text-signal">
                {x.i}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-white">{x.l}</span>
                <span className="block truncate font-mono text-[10.5px] text-mute">{x.s}</span>
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
