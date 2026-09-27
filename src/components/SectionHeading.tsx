import Reveal from './Reveal';

export default function SectionHeading({
  index,
  kicker,
  title,
  lead,
  align = 'left',
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal className={`mb-12 md:mb-16 ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <div className={`mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="font-mono text-[11px] text-signal">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-signal/70 to-transparent" />
        <span className="label">{kicker}</span>
      </div>
      <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.02] tracking-tightest">{title}</h2>
      {lead && <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-mute md:text-[17.5px]">{lead}</p>}
    </Reveal>
  );
}
