import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ChipLogo from './ChipLogo';
import { GitHubIcon, DocIcon } from './Icons';
import { profile, asset } from '../data/profile';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'asic', label: 'ASIC' },
  { id: 'fpga', label: 'FPGA' },
  { id: 'embedded', label: 'Embedded' },
  { id: 'research', label: 'Research' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const { pathname } = useLocation();
  const onHome = pathname === '/' || pathname === '';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) { setActive(''); return; }
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome, pathname]);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const resumeHref = profile.resume.available ? asset(profile.resume.path) : '/#resume';

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-[1180px] items-center justify-between gap-3 rounded-full border transition-all duration-500 ${
          scrolled
            ? 'border-white/10 bg-ink-900/75 py-1.5 pl-3 pr-1.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl'
            : 'border-white/[0.06] bg-ink-900/40 py-2.5 pl-4 pr-2 backdrop-blur-md'
        }`}
      >
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Gaurav Anand — home">
          <ChipLogo size={scrolled ? 26 : 30} />
          <span className="font-display text-[15px] font-semibold tracking-tight text-white">
            GAURAV<span className="text-signal"> </span>ANAND
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <Link
                to={`/#${n.id}`}
                aria-current={active === n.id ? 'true' : undefined}
                className={`relative rounded-full px-3 py-2 text-[13.5px] transition-colors ${
                  active === n.id ? 'text-white' : 'text-mute hover:text-white'
                }`}
              >
                {active === n.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-1.5 lg:flex">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2.5 !text-[11.5px]">
            <GitHubIcon /> GitHub
          </a>
          <a href={resumeHref} {...(profile.resume.available ? { target: '_blank', rel: 'noreferrer' } : {})} className="btn-primary !px-4 !py-2.5 !text-[11.5px]">
            <DocIcon /> Resume
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-4">
            <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 top-[72px] rounded-3xl border border-white/10 bg-ink-900/95 p-3 backdrop-blur-xl lg:hidden"
          >
            <ul className="grid gap-1">
              {NAV.map((n, i) => (
                <li key={n.id}>
                  <Link to={`/#${n.id}`} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] text-white hover:bg-white/5">
                    <span>{n.label}</span>
                    <span className="font-mono text-[11px] text-mute">0{i + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-ghost justify-center"><GitHubIcon /> GitHub</a>
              <a href={resumeHref} onClick={() => setOpen(false)} className="btn-primary justify-center"><DocIcon /> Resume</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
