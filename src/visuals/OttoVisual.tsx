import { useEffect, useRef, useState } from 'react';

/** Otto-style robot whose HC-SR04 "eyes" track the cursor, with the joystick → UDP → servo chain. */
export default function OttoVisual({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [e, setE] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const on = (ev: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = ev.clientX - (r.left + r.width * 0.5);
        const dy = ev.clientY - (r.top + r.height * 0.38);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260) * 7;
        setE({ x: (dx / d) * k, y: (dy / d) * k });
      });
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 320 300" className={`h-auto w-full ${className}`} role="img" aria-label="Otto Ninja style robot with an HC-SR04 ultrasonic sensor as eyes, driven by two servos">
      <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace">
        {/* ultrasonic ping */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${230 + i * 14} 58 q12 30 0 60`} fill="none" stroke="rgb(79 212 255)" strokeWidth="1.3" className="pulse" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
        {/* head */}
        <rect x="80" y="30" width="160" height="112" rx="18" fill="#0e1322" stroke="rgba(197,203,224,0.45)" strokeWidth="1.5" />
        {/* HC-SR04 board */}
        <rect x="98" y="58" width="124" height="60" rx="6" fill="#0a2240" stroke="rgba(79,212,255,0.5)" />
        {[128, 192].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="88" r="22" fill="#b7bfd4" stroke="#6d7690" strokeWidth="2" />
            <circle cx={cx} cy="88" r="15" fill="#1a1f2e" />
            <circle cx={cx + e.x} cy={88 + e.y} r="6.5" fill="rgb(79 212 255)" />
            <circle cx={cx + e.x + 2} cy={86 + e.y} r="2" fill="#fff" />
          </g>
        ))}
        <text x="160" y="132" textAnchor="middle" fontSize="7.5" fill="rgba(197,203,224,0.55)" letterSpacing="1">HC-SR04</text>
        {/* body */}
        <rect x="96" y="148" width="128" height="62" rx="10" fill="#0e1322" stroke="rgba(197,203,224,0.35)" />
        <rect x="120" y="162" width="80" height="32" rx="4" fill="rgba(143,124,255,0.1)" stroke="rgb(143 124 255)" />
        <text x="160" y="182" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff">ESP32</text>
        <circle cx="210" cy="160" r="3" fill="rgb(79 212 255)" className="clk" />
        {/* legs + wheels */}
        <rect x="104" y="210" width="26" height="40" rx="5" fill="#141b2e" stroke="rgba(197,203,224,0.3)" />
        <rect x="190" y="210" width="26" height="40" rx="5" fill="#141b2e" stroke="rgba(197,203,224,0.3)" />
        {[117, 203].map((cx, i) => (
          <g key={cx} style={{ transformOrigin: `${cx}px 262px`, animation: `spin 2.2s linear infinite ${i ? 'reverse' : ''}` }}>
            <circle cx={cx} cy="262" r="18" fill="#0e1322" stroke="rgb(79 212 255)" strokeWidth="1.5" />
            <path d={`M${cx - 18} 262h36M${cx} 244v36`} stroke="rgba(79,212,255,0.4)" />
          </g>
        ))}
        <text x="60" y="266" textAnchor="middle" fontSize="8" fill="rgba(197,203,224,0.55)">SERVO L</text>
        <text x="262" y="266" textAnchor="middle" fontSize="8" fill="rgba(197,203,224,0.55)">SERVO R</text>
        {/* udp link */}
        <path d="M24 176h72" stroke="rgb(143 124 255)" strokeWidth="1.5" className="sig-fast" />
        <text x="24" y="168" fontSize="8" fill="rgb(143 124 255)">UDP :4210</text>
      </g>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
