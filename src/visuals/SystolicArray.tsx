const GX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
const GY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
const PE = 44;
const STEP = 54;
const ROWS = [44, 98, 152];

function Array3({ ox, k, name, color }: { ox: number; k: number[][]; name: string; color: string }) {
  return (
    <g>
      <text x={ox + 76} y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill={`rgb(${color})`} letterSpacing="1.5">{name} ARRAY</text>
      {k.map((row, j) =>
        row.map((w, i) => {
          const x = ox + i * STEP;
          const y = ROWS[j];
          return (
            <g key={`${i}${j}`}>
              <rect x={x} y={y} width={PE} height={PE} rx="7" fill="#0c111f" stroke={`rgb(${color} / 0.45)`} strokeWidth="1.1">
                <animate attributeName="fill" values={`#0c111f;rgb(${color} / 0.28);#0c111f`} dur="2.4s" begin={`${(i + j) * 0.3}s`} repeatCount="indefinite" />
              </rect>
              <text x={x + PE / 2} y={y + 17} textAnchor="middle" fontSize="8" fill="rgba(197,203,224,0.5)">PE{j}{i}</text>
              <text x={x + PE / 2} y={y + 33} textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">{w > 0 ? `+${w}` : w}</text>
            </g>
          );
        }),
      )}
      {/* horizontal pixel links + vertical psum links */}
      <g stroke={`rgb(${color} / 0.25)`} strokeWidth="1.2">
        {ROWS.map((y) => [0, 1].map((i) => <path key={`${y}${i}`} d={`M${ox + i * STEP + PE} ${y + 22}h${STEP - PE}`} />))}
        {[0, 1, 2].map((i) => [0, 1].map((j) => <path key={`v${i}${j}`} d={`M${ox + i * STEP + 22} ${ROWS[j] + PE}v${STEP - PE}`} />))}
      </g>
    </g>
  );
}

export default function SystolicArray({ className = '', animate = true }: { className?: string; animate?: boolean }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = animate && !reduce;
  return (
    <svg viewBox="0 0 640 230" className={`h-auto w-full ${className}`} role="img" aria-label="Window generator feeding parallel 3 by 3 Sobel Gx and Gy systolic arrays; pixels flow right, partial sums flow down, then |Gx| + |Gy| is written to the result buffer">
      <g fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace">
        {/* window generator */}
        <rect x="8" y="70" width="84" height="84" rx="8" fill="#0e1322" stroke="rgba(197,203,224,0.35)" />
        <text x="50" y="100" textAnchor="middle" fontSize="9.5" fill="#fff">WINDOW</text>
        <text x="50" y="113" textAnchor="middle" fontSize="9.5" fill="#fff">GEN</text>
        <g>
          {[0, 1, 2].map((j) => [0, 1, 2].map((i) => <rect key={`${i}${j}`} x={36 + i * 10} y={122 + j * 8} width="8" height="6" rx="1" fill="rgba(79,212,255,0.35)" />))}
        </g>

        {/* feed lines */}
        <g stroke="rgba(130,150,200,0.28)" strokeWidth="1.2" fill="none">
          {ROWS.map((y) => <path key={y} d={`M92 112 C110 112 110 ${y + 22} 128 ${y + 22}`} />)}
          {ROWS.map((y) => <path key={`b${y}`} d={`M92 112 C200 ${y < 90 ? 20 : 214} 300 ${y + 22} 330 ${y + 22}`} strokeOpacity=".5" />)}
        </g>

        <Array3 ox={130} k={GX} name="Gx" color="79 212 255" />
        <Array3 ox={330} k={GY} name="Gy" color="143 124 255" />

        {/* combine */}
        <g stroke="rgba(130,150,200,0.3)" strokeWidth="1.2" fill="none">
          <path d="M152 196v14h380v-66" />
          <path d="M352 196v14" />
          <path d="M572 116v-30" />
        </g>
        <rect x="524" y="116" width="108" height="30" rx="7" fill="rgba(255,95,134,0.1)" stroke="rgb(255 95 134)" />
        <text x="578" y="135" textAnchor="middle" fontSize="10.5" fill="#fff">|Gx| + |Gy|</text>
        <rect x="524" y="48" width="108" height="38" rx="7" fill="#0e1322" stroke="rgba(197,203,224,0.35)" />
        <text x="578" y="64" textAnchor="middle" fontSize="9.5" fill="#fff">RESULT</text>
        <text x="578" y="77" textAnchor="middle" fontSize="9.5" fill="#fff">BUFFER</text>
        <text x="578" y="36" textAnchor="middle" fontSize="8.5" fill="rgba(197,203,224,0.5)">edge map →</text>

        {run && (
          <g>
            {ROWS.map((y, j) => (
              <g key={j}>
                <circle r="3" fill="rgb(79 212 255)">
                  <animateMotion dur="2.4s" begin={`${j * 0.3}s`} repeatCount="indefinite" path={`M92 112 C110 112 110 ${y + 22} 128 ${y + 22} H284`} />
                </circle>
                <circle r="3" fill="rgb(143 124 255)">
                  <animateMotion dur="2.4s" begin={`${j * 0.3 + 0.15}s`} repeatCount="indefinite" path={`M330 ${y + 22} H484`} />
                </circle>
              </g>
            ))}
            {[0, 1, 2].map((i) => (
              <g key={`s${i}`}>
                <rect width="5" height="5" x="-2.5" y="-2.5" fill="rgb(255 95 134)">
                  <animateMotion dur="2.4s" begin={`${i * 0.3 + 0.6}s`} repeatCount="indefinite" path={`M${130 + i * STEP + 22} 44 V196`} />
                </rect>
                <rect width="5" height="5" x="-2.5" y="-2.5" fill="rgb(255 95 134)">
                  <animateMotion dur="2.4s" begin={`${i * 0.3 + 0.75}s`} repeatCount="indefinite" path={`M${330 + i * STEP + 22} 44 V196`} />
                </rect>
              </g>
            ))}
            <circle r="3.2" fill="rgb(255 95 134)">
              <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M152 210 H532 V146 M578 116 V86" />
            </circle>
          </g>
        )}
      </g>
    </svg>
  );
}
