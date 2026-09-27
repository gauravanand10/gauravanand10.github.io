import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SiliconDie from '../visuals/SiliconDie';
import { Arrow, ArrowUpRight, GitHubIcon } from '../components/Icons';
import { profile } from '../data/profile';

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center pb-16 pt-28 md:pt-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div className="relative z-10">
          <h1 id="hero-title" className="text-[clamp(1.9rem,8.4vw,3.9rem)] font-extrabold leading-[1.02] tracking-tightest">
            <span className="sr-only">Gaurav Anand — </span>
            {[
              ['Logic,', 'verified.'],
              ['Silicon,', 'synthesized.'],
              ['Systems,', 'built.'],
            ].map(([a, b], i) => (
              <motion.span
                key={a}
                className="block whitespace-nowrap"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.14, ease }}
              >
                <span className="text-grad">{a}</span> <span className="text-white">{b}</span>
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.8 }} className="mt-8 font-mono text-[11.5px] uppercase leading-relaxed tracking-[0.14em] text-signal/90 md:text-[12.5px]">
            VLSI • ASIC • FPGA • RISC-V • Hardware Acceleration • Embedded
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8, ease }} className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-mute md:text-[18px]">
            Electronics engineering student exploring digital hardware architecture, VLSI design, FPGA acceleration, verification and real-world embedded systems.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease }} className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/#projects" className="btn-primary">
              Explore my work <Arrow />
            </Link>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <GitHubIcon /> GitHub <ArrowUpRight />
            </a>
          </motion.div>

          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.8 }} className="mt-12 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            <div className="bg-ink-900/90 px-4 py-3">
              <dt className="label !text-[9.5px]">Studying</dt>
              <dd className="mt-1 text-[13.5px] text-fog">B.Tech · VLSI Design · TIET</dd>
            </div>
            <div className="bg-ink-900/90 px-4 py-3">
              <dt className="label !text-[9.5px]">Member</dt>
              <dd className="mt-1 text-[13.5px] text-fog">
                <a className="hover:text-signal" href={profile.org.url} target="_blank" rel="noreferrer">@{profile.org.name}</a>
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.25, ease }} className="relative">
          <SiliconDie />
        </motion.div>
      </div>

      <a href="#marquee" aria-label="Scroll down" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-mute md:flex">
        scroll
        <span className="block h-8 w-px overflow-hidden bg-white/10">
          <span className="block h-3 w-px animate-[marquee_1.6s_linear_infinite] bg-signal" />
        </span>
      </a>
    </section>
  );
}
