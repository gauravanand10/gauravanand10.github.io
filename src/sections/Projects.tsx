import { projects } from '../data/projects';
import SectionHeading from '../components/SectionHeading';
import FeaturedProject from '../components/FeaturedProject';
import ProjectCard from '../components/ProjectCard';
import LiveSobel from '../visuals/LiveSobel';
import Reveal from '../components/Reveal';
import { asset } from '../data/profile';

export default function Projects() {
  const [pamac, sobel, ahb, tof, quad, otto] = projects;
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-28 md:py-36">
      <div className="wrap">
        <SectionHeading
          index="02"
          kicker="Selected work"
          title={<span id="projects-title">Case studies, <span className="text-grad">not cards.</span></span>}
          lead="Each project runs the same path — problem, architecture, implementation, verification, result, code. Every number shown comes from a report in the linked repository."
        />

        <FeaturedProject p={pamac} />

        <div className="mt-8 grid gap-8">
          <ProjectCard
            p={sobel}
            layout="split"
            extra={
              <div className="rounded-xl border border-line bg-ink-900/60 p-4">
                <LiveSobel />
              </div>
            }
          />
          <ProjectCard p={ahb} layout="split-rev" />
        </div>

        <Reveal id="embedded" className="mb-10 mt-24 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[11px] text-signal">02.b</span>
              <span className="h-px w-10 bg-gradient-to-r from-signal/70 to-transparent" />
              <span className="label">Embedded · real systems</span>
            </div>
            <h3 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-tightest">Then I build systems around it.</h3>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-mute">Sensors, radios, motors and control loops — firmware that has to work on a bench, not just in a simulator.</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12">
          <ProjectCard p={quad} className="lg:col-span-7" />
          <ProjectCard p={tof} className="lg:col-span-5" />
          <ProjectCard
            p={otto}
            layout="split-rev"
            className="lg:col-span-12"
            extra={
              <div className="grid grid-cols-2 gap-3">
                <img src={asset('images/otto-robot.webp')} alt="Otto Ninja robot hardware" loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-xl border border-line object-cover" />
                <img src={asset('images/transmitter.webp')} alt="ESP32 joystick transmitter" loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-xl border border-line object-cover" />
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
