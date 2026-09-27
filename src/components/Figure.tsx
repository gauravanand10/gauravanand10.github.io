import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Figure as F } from '../data/projects';

export default function Figure({ f, repo }: { f: F; repo: string | null }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  if (failed) {
    return (
      <figure className="grid min-h-[160px] place-items-center rounded-xl border border-dashed border-line bg-ink-900/50 p-6 text-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{f.caption}</p>
          {repo && <a className="mt-2 inline-block font-mono text-[11px] text-signal hover:underline" href={repo} target="_blank" rel="noreferrer">view in repository ↗</a>}
        </div>
      </figure>
    );
  }

  return (
    <>
      <figure className="group">
        <button onClick={() => setOpen(true)} className="block w-full overflow-hidden rounded-xl border border-line bg-white/[0.02] text-left" aria-label={`Expand image: ${f.caption}`}>
          <img src={f.src} alt={f.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="max-h-[420px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
        </button>
        <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute">{f.caption}</figcaption>
      </figure>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={f.caption}
            className="fixed inset-0 z-[80] grid place-items-center bg-ink-950/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.img src={f.src} alt={f.alt} initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.97 }} className="max-h-[88vh] max-w-full rounded-xl border border-white/10 object-contain" />
            <button autoFocus className="absolute right-4 top-4 rounded-full border border-white/15 bg-ink-900 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white" onClick={() => setOpen(false)}>Close ✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
