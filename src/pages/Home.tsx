import Hero from '../sections/Hero';
import TechMarquee from '../sections/TechMarquee';
import About from '../sections/About';
import Projects from '../sections/Projects';
import ASICFlow from '../sections/ASICFlow';
import FPGA from '../sections/FPGA';
import Verification from '../sections/Verification';
import Research from '../sections/Research';
import Skills from '../sections/Skills';
import GitHubSection from '../sections/GitHubSection';
import Resume from '../sections/Resume';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Projects />
      <ASICFlow />
      <FPGA />
      <Verification />
      <Research />
      <Skills />
      <GitHubSection />
      <Resume />
      <Contact />
    </>
  );
}
