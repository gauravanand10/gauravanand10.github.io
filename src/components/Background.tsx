import { useEffect } from 'react';

/**
 * Fixed backdrop: a faint engineering grid everywhere, and a brighter
 * routing layer (traces + vias) that only shows under the cursor —
 * like shining a probe light across a die.
 */
export default function Background() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const root = document.documentElement;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--mx', `${e.clientX}px`);
        root.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 600px at 78% -10%, rgba(143,124,255,0.10), transparent 60%), radial-gradient(800px 600px at 5% 10%, rgba(79,212,255,0.07), transparent 60%)',
        }}
      />
      <svg className="bg-reveal absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="routing" width="192" height="192" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="rgba(79,212,255,0.35)" strokeWidth="1">
              <path d="M0 24h60l24 24h60l24-24h24" />
              <path d="M24 0v48l24 24v72l-24 24v24" />
              <path d="M120 192v-36l24-24h48" />
              <path d="M96 96h36l12 12v36h48" stroke="rgba(143,124,255,0.35)" />
              <path d="M0 144h36l12-12V96" stroke="rgba(143,124,255,0.3)" />
            </g>
            <g fill="rgba(79,212,255,0.55)">
              <circle cx="84" cy="48" r="2.2" /><circle cx="48" cy="72" r="2.2" /><circle cx="144" cy="132" r="2.2" />
              <circle cx="96" cy="96" r="2.2" /><circle cx="48" cy="132" r="2.2" />
            </g>
            <path d="M0 0h192v192" fill="none" stroke="rgba(130,150,200,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#routing)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}
