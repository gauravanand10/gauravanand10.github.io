import { motion } from 'framer-motion';

/** A chain of stages joined by live "signal" connectors. Vertical on mobile, horizontal from md up when `horizontal`. */
export default function FlowChain({
  steps,
  horizontal = false,
  highlight = [],
  className = '',
}: {
  steps: string[];
  horizontal?: boolean;
  highlight?: number[];
  className?: string;
}) {
  return (
    <ol className={`flex flex-col items-stretch ${horizontal ? 'md:flex-row md:items-center' : ''} ${className}`}>
      {steps.map((s, i) => (
        <li key={s + i} className={`flex flex-col items-center ${horizontal ? 'md:flex-row md:flex-1' : ''}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className={`w-full whitespace-nowrap rounded-lg border px-3 py-2.5 text-center font-mono text-[11.5px] uppercase tracking-[0.08em] ${
              highlight.includes(i)
                ? 'border-signal/50 bg-signal/10 text-signal'
                : 'border-line bg-ink-850 text-fog'
            } ${horizontal ? 'md:w-auto md:min-w-0 md:flex-1 md:whitespace-normal md:px-2' : ''}`}
          >
            {s}
          </motion.div>
          {i < steps.length - 1 && (
            <svg
              aria-hidden
              className={`h-7 w-3 shrink-0 ${horizontal ? 'md:h-3 md:w-7 md:rotate-[-90deg]' : ''}`}
              viewBox="0 0 12 28"
            >
              <path d="M6 0v28" stroke="rgba(130,150,200,0.25)" strokeWidth="1.5" />
              <path d="M6 0v28" stroke="rgb(79 212 255)" strokeWidth="1.5" className="sig-fast" />
              <path d="M2.5 22 6 26l3.5-4" fill="none" stroke="rgb(79 212 255)" strokeWidth="1.5" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}
