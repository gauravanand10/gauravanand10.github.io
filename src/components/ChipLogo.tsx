import { useEffect, useRef, useState } from 'react';

/** Tiny chip glyph whose two status LEDs track the cursor. */
export default function ChipLogo({ size = 30 }: { size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [o, setO] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 200) * 1.6;
        setO({ x: (dx / d) * k, y: (dy / d) * k });
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <g stroke="rgb(79 212 255)" strokeWidth="1.6" strokeLinecap="round">
        {[11, 16, 21].map((p) => (
          <g key={p}>
            <path d={`M${p} 2.5v3.5M${p} 26v3.5M2.5 ${p}h3.5M26 ${p}h3.5`} />
          </g>
        ))}
      </g>
      <rect x="6.5" y="6.5" width="19" height="19" rx="3.5" fill="#0e1322" stroke="rgb(143 124 255)" strokeWidth="1.4" />
      <rect x="10" y="12" width="4.5" height="6" rx="1.2" fill="#070a12" />
      <rect x="17.5" y="12" width="4.5" height="6" rx="1.2" fill="#070a12" />
      <circle cx={12.25 + o.x * 0.8} cy={15 + o.y} r="1.35" fill="rgb(79 212 255)" />
      <circle cx={19.75 + o.x * 0.8} cy={15 + o.y} r="1.35" fill="rgb(79 212 255)" />
      <path d="M12 21.5h8" stroke="rgb(143 124 255)" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
