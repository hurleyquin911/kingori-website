const C = 200;

function pt(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

function arc(r: number, from: number, to: number) {
  const [x1, y1] = pt(r, from);
  const [x2, y2] = pt(r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const START = 150;
const SWEEP = 240;

export function Speedometer({ className = "" }: { className?: string }) {
  const ticks = [];
  for (let i = 0; i <= 48; i++) {
    const deg = START + (i * SWEEP) / 48;
    const major = i % 4 === 0;
    const [x1, y1] = pt(major ? 136 : 144, deg);
    const [x2, y2] = pt(156, deg);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i >= 40 ? "#ff4a1c" : major ? "#eceef2" : "#6b7280"}
        strokeWidth={major ? 3.5 : 1.6}
        strokeLinecap="round"
      />,
    );
    if (major) {
      const [tx, ty] = pt(114, deg);
      ticks.push(
        <text
          key={`t${i}`}
          x={tx}
          y={ty + 5}
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill={i >= 40 ? "#ff4a1c" : "#a3aab6"}
          fontFamily="var(--font-chakra)"
        >
          {i * 5}
        </text>,
      );
    }
  }

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Speedometer King Ori">
      <defs>
        <linearGradient id="spd-arc" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2fd3ff" />
          <stop offset="0.55" stopColor="#ffc414" />
          <stop offset="1" stopColor="#ff4a1c" />
        </linearGradient>
        <radialGradient id="spd-face" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#1d2129" />
          <stop offset="1" stopColor="#07080a" />
        </radialGradient>
        <linearGradient id="spd-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f3f5" />
          <stop offset="0.5" stopColor="#5f6672" />
          <stop offset="1" stopColor="#c9ced8" />
        </linearGradient>
        <filter id="spd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={C} cy={C} r="196" fill="url(#spd-bezel)" />
      <circle cx={C} cy={C} r="188" fill="url(#spd-face)" />
      <circle cx={C} cy={C} r="188" fill="none" stroke="#000" strokeOpacity=".6" strokeWidth="4" />

      <path d={arc(170, START, START + SWEEP)} stroke="#1f232b" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path
        d={arc(170, START, START + SWEEP)}
        stroke="url(#spd-arc)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        filter="url(#spd-glow)"
      />
      <path d={arc(150, START + 200, START + SWEEP)} stroke="#ff4a1c" strokeOpacity=".22" strokeWidth="18" fill="none" />

      {ticks}

      <text x={C} y="262" textAnchor="middle" fontSize="13" fontWeight="600" fill="#6b7280" letterSpacing="4" fontFamily="var(--font-chakra)">
        KM/H
      </text>
      <rect x="138" y="276" width="124" height="40" rx="8" fill="#050607" stroke="#262b35" />
      <text x={C} y="303" textAnchor="middle" fontSize="20" fontWeight="700" fill="#2fd3ff" letterSpacing="3" fontFamily="var(--font-chakra)" fontStyle="italic">
        100% ORI
      </text>

      <g className="origin-center animate-needle" style={{ transformBox: "view-box" }}>
        <path d="M200 52 L207 200 L200 214 L193 200 Z" fill="#ff4a1c" filter="url(#spd-glow)" />
        <path d="M200 52 L202 200 L198 200 Z" fill="#fff" opacity=".7" />
      </g>
      <circle cx={C} cy={C} r="22" fill="url(#spd-bezel)" />
      <circle cx={C} cy={C} r="12" fill="#0b0c0f" />
      <circle cx={C} cy={C} r="4" fill="#ff4a1c" />
    </svg>
  );
}
