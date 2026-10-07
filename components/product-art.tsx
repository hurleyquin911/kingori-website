import { useId, type ReactNode } from "react";
import type { ArtKind } from "@/lib/products";

type Paint = (key: "metal" | "acc" | "dark" | "glass" | "glow" | "shade") => string;

const mix = (color: string, with_: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, ${with_})`;

function polar(r: number, deg: number, cx = 100, cy = 100) {
  const a = (deg * Math.PI) / 180;
  const round = (n: number) => Math.round(n * 100) / 100;
  return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))] as const;
}

function gearPoints(teeth: number, outer: number, root: number) {
  const step = 360 / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [f, r] of [
      [0.08, root],
      [0.32, outer],
      [0.62, outer],
      [0.86, root],
    ] as const) {
      const [x, y] = polar(r, a + f * step);
      pts.push(`${x},${y}`);
    }
  }
  return pts.join(" ");
}

const shapes: Record<ArtKind, (p: Paint, accent: string) => ReactNode> = {
  helmet: (p) => (
    <g>
      <path d="M38 128C34 84 62 44 108 40c40-3 64 24 66 60l2 32c0 14-10 24-24 24H74c-18 0-34-10-36-28z" fill={p("acc")} />
      <path d="M38 128C34 84 62 44 108 40c40-3 64 24 66 60l2 32c0 14-10 24-24 24H74c-18 0-34-10-36-28z" fill={p("shade")} />
      <path d="M52 100c16-38 52-52 92-46" stroke="#fff" strokeOpacity=".85" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M50 114c18-40 58-56 100-48" stroke="#ffc414" strokeOpacity=".9" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M104 82c22-10 54-6 68 14l2 24c-24-6-50-6-74 0-6-14-4-30 4-38z" fill={p("glass")} />
      <path d="M112 86c18-6 38-4 52 6" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="104" r="8" fill={p("metal")} />
      <path d="M44 140c16 12 46 16 106 16" stroke="#0b0c0f" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g stroke="#0b0c0f" strokeWidth="3" strokeLinecap="round">
        <path d="M150 134h14M152 141h12" />
      </g>
    </g>
  ),
  headlight: (p, accent) => (
    <g>
      <circle cx="100" cy="98" r="86" fill={p("glow")} />
      <rect x="90" y="16" width="20" height="14" rx="3" fill={p("dark")} />
      <rect x="90" y="166" width="20" height="14" rx="3" fill={p("dark")} />
      <circle cx="100" cy="98" r="68" fill={p("dark")} />
      <circle cx="100" cy="98" r="60" fill="none" stroke={p("metal")} strokeWidth="8" />
      <circle cx="100" cy="98" r="50" fill="#d9dde3" />
      <circle cx="100" cy="98" r="50" fill={p("metal")} opacity=".6" />
      <circle cx="100" cy="98" r="42" fill="none" stroke={accent} strokeWidth="4" />
      <circle cx="100" cy="98" r="42" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" />
      <circle cx="100" cy="98" r="28" fill={p("glass")} />
      <circle cx="100" cy="98" r="14" fill="#fff" opacity=".95" />
      <path d="M84 84a22 22 0 0 1 18-8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  ),
  mirror: (p, accent) => (
    <g>
      <path d="M104 176c-4-26 10-46-2-72" stroke={p("metal")} strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="88" y="166" width="32" height="14" rx="4" fill={p("dark")} />
      <circle cx="104" cy="173" r="4" fill={p("metal")} />
      <circle cx="102" cy="106" r="8" fill={accent} />
      <g transform="rotate(-14 100 70)">
        <ellipse cx="100" cy="70" rx="66" ry="38" fill={accent} />
        <ellipse cx="100" cy="70" rx="66" ry="38" fill={p("shade")} />
        <ellipse cx="100" cy="70" rx="57" ry="30" fill="#0b0c0f" />
        <ellipse cx="100" cy="70" rx="54" ry="27" fill={p("glass")} />
        <path d="M60 60c14-14 40-18 60-14" stroke="#fff" strokeOpacity=".65" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </g>
  ),
  oil: (p, accent) => (
    <g>
      <rect x="74" y="30" width="32" height="24" rx="4" fill={p("dark")} />
      <g stroke="#3b4252" strokeWidth="2">
        <path d="M80 32v20M86 32v20M92 32v20M98 32v20" />
      </g>
      <rect x="78" y="52" width="24" height="8" fill={p("metal")} />
      <path d="M60 72q0-14 14-14h40l26 26v84q0 12-12 12H72q-12 0-12-12z" fill={accent} />
      <path d="M60 72q0-14 14-14h40l26 26v84q0 12-12 12H72q-12 0-12-12z" fill={p("shade")} />
      <rect x="116" y="80" width="12" height="30" rx="5" fill="#101216" />
      <rect x="66" y="66" width="7" height="104" rx="3.5" fill="#fff" opacity=".25" />
      <rect x="68" y="108" width="64" height="58" rx="5" fill="#0b0c0f" />
      <rect x="68" y="108" width="64" height="10" rx="3" fill="#ffc414" />
      <text x="100" y="116" textAnchor="middle" fontSize="7" fontWeight="800" fill="#0b0c0f" fontFamily="sans-serif">KING ORI</text>
      <text x="100" y="142" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="sans-serif" fontStyle="italic">10W-30</text>
      <text x="100" y="156" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#a3aab6" fontFamily="sans-serif" letterSpacing="1.5">FULL SYNTHETIC</text>
    </g>
  ),
  brake: (p, accent) => {
    const holes: ReactNode[] = [];
    for (let i = 0; i < 30; i++) {
      const [x, y] = polar(i % 2 ? 50 : 58, i * 12);
      holes.push(<circle key={i} cx={x} cy={y} r="3.4" fill="#15181e" />);
    }
    const rivets: ReactNode[] = [];
    for (let i = 0; i < 8; i++) {
      const [x, y] = polar(36, i * 45 + 22.5);
      rivets.push(<circle key={i} cx={x} cy={y} r="4" fill="#ffc414" stroke="#0b0c0f" strokeWidth="1.2" />);
    }
    const bolts: ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      const [x, y] = polar(19, i * 72 - 90);
      bolts.push(<circle key={i} cx={x} cy={y} r="4" fill="#0b0c0f" />);
    }
    return (
      <g>
        <circle cx="100" cy="100" r="72" fill={p("metal")} />
        <circle cx="100" cy="100" r="66" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="1" />
        {holes}
        <circle cx="100" cy="100" r="40" fill="#20242c" />
        <circle cx="100" cy="100" r="31" fill={accent} />
        <circle cx="100" cy="100" r="31" fill={p("shade")} />
        {rivets}
        {bolts}
        <circle cx="100" cy="100" r="9" fill="#0b0c0f" />
        <path d="M62 45.5a68 68 0 0 1 76 0" stroke={accent} strokeWidth="30" fill="none" strokeLinecap="round" />
        <path d="M66 40a64 64 0 0 1 68 0" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="100" y="45" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="sans-serif" fontStyle="italic" letterSpacing="2">KING</text>
      </g>
    );
  },
  sparkplug: (p, accent) => (
    <g transform="rotate(32 100 100)">
      <rect x="93" y="14" width="14" height="14" rx="3" fill={p("metal")} />
      <path d="M89 28h22l5 52H84z" fill="#eef0f3" />
      <path d="M89 28h22l5 52H84z" fill={p("shade")} opacity=".6" />
      <g stroke="#c5cad3" strokeWidth="2">
        <path d="M88 40h24M87 50h26M86 60h28" />
      </g>
      <rect x="78" y="80" width="44" height="28" rx="3" fill={p("metal")} />
      <g stroke="#5b616c" strokeWidth="1.5">
        <path d="M90 80v28M110 80v28" />
      </g>
      <rect x="82" y="108" width="36" height="7" fill={accent} />
      <rect x="87" y="115" width="26" height="40" fill={p("metal")} />
      <g stroke="#4b515c" strokeWidth="2">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M87 ${119 + i * 5.4}l26 -4`} />
        ))}
      </g>
      <rect x="96" y="155" width="8" height="10" fill="#9aa1ad" />
      <path d="M104 166h8v8H94" stroke={p("metal")} strokeWidth="4" fill="none" strokeLinejoin="round" />
      <path d="M100 180l-8 12 7-1-4 10 11-14-7 1 4-8z" fill="#2fd3ff" />
    </g>
  ),
  gloves: (p, accent) => (
    <g>
      <rect x="38" y="78" width="16" height="50" rx="8" transform="rotate(-34 46 103)" fill="#232832" />
      <rect x="66" y="36" width="16" height="58" rx="8" fill="#232832" />
      <rect x="85" y="24" width="16" height="68" rx="8" fill="#232832" />
      <rect x="104" y="28" width="16" height="64" rx="8" fill="#232832" />
      <rect x="122" y="42" width="15" height="52" rx="7.5" fill="#232832" />
      <g fill={p("metal")}>
        <rect x="66" y="36" width="16" height="11" rx="6" />
        <rect x="85" y="24" width="16" height="11" rx="6" />
        <rect x="104" y="28" width="16" height="11" rx="6" />
        <rect x="122" y="42" width="15" height="10" rx="6" />
      </g>
      <path d="M64 138l-2-46q0-12 12-12h54q12 0 12 12l-2 46z" fill="#232832" />
      <path d="M64 138l-2-46q0-12 12-12h54q12 0 12 12l-2 46z" fill={p("shade")} />
      <rect x="64" y="78" width="74" height="22" rx="10" fill={accent} />
      <rect x="64" y="78" width="74" height="22" rx="10" fill={p("shade")} />
      <g stroke="#0b0c0f" strokeWidth="2.5" strokeLinecap="round">
        <path d="M80 84v10M92 84v10M104 84v10M116 84v10M128 84v10" />
      </g>
      <rect x="60" y="134" width="82" height="40" rx="10" fill="#15181e" />
      <rect x="58" y="142" width="86" height="16" rx="8" fill={accent} />
      <text x="101" y="154" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" fontFamily="sans-serif" fontStyle="italic" letterSpacing="2">KING ORI</text>
    </g>
  ),
  phoneholder: (p, accent) => (
    <g>
      <rect x="94" y="122" width="12" height="46" fill={p("metal")} />
      <rect x="70" y="164" width="60" height="16" rx="8" fill={p("dark")} />
      <circle cx="100" cy="124" r="11" fill={p("metal")} />
      <rect x="56" y="58" width="13" height="56" rx="5" fill={accent} />
      <rect x="131" y="58" width="13" height="56" rx="5" fill={accent} />
      <rect x="66" y="26" width="68" height="112" rx="13" fill="#0b0c0f" stroke="#3b4252" strokeWidth="3" />
      <rect x="71" y="34" width="58" height="96" rx="7" fill="#0b2a3a" />
      <g stroke="#1d4d63" strokeWidth="2">
        <path d="M71 60h58M71 92h58M90 34v96M114 34v96" />
      </g>
      <path d="M80 120c6-18 30-10 30-30s16-22 12-40" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="120" r="4" fill="#fff" />
      <path d="M122 42a6 6 0 0 1 6 6c0 5-6 10-6 10s-6-5-6-10a6 6 0 0 1 6-6z" fill="#ffc414" />
      <rect x="84" y="20" width="32" height="10" rx="4" fill={accent} />
      <rect x="84" y="134" width="32" height="10" rx="4" fill={accent} />
      <rect x="56" y="58" width="13" height="56" rx="5" fill={p("shade")} />
      <rect x="131" y="58" width="13" height="56" rx="5" fill={p("shade")} />
    </g>
  ),
  charger: (p, accent) => (
    <g>
      <path d="M100 154c0 24-42 18-50 34" stroke="#1f2430" strokeWidth="7" fill="none" strokeLinecap="round" />
      <rect x="86" y="142" width="28" height="14" rx="3" fill={p("metal")} />
      <circle cx="100" cy="96" r="70" fill={p("glow")} />
      <rect x="62" y="54" width="76" height="92" rx="16" fill={p("dark")} />
      <rect x="62" y="54" width="76" height="92" rx="16" fill={p("shade")} />
      <rect x="70" y="62" width="60" height="58" rx="9" fill="#0b0c0f" />
      <rect x="76" y="68" width="48" height="22" rx="3" fill="#03202b" />
      <text x="100" y="85" textAnchor="middle" fontSize="15" fontWeight="700" fill={accent} fontFamily="monospace">12.6V</text>
      <rect x="78" y="98" width="18" height="9" rx="1.5" fill="#ff7a2f" />
      <rect x="104" y="98" width="18" height="9" rx="1.5" fill="#3b82f6" />
      <rect x="81" y="101" width="12" height="2.5" fill="#0b0c0f" />
      <rect x="107" y="101" width="12" height="2.5" fill="#0b0c0f" />
      <text x="87" y="116" textAnchor="middle" fontSize="5" fontWeight="700" fill="#a3aab6" fontFamily="sans-serif">QC3.0</text>
      <text x="113" y="116" textAnchor="middle" fontSize="5" fontWeight="700" fill="#a3aab6" fontFamily="sans-serif">2.4A</text>
      <circle cx="100" cy="132" r="7" fill={p("metal")} />
      <circle cx="100" cy="132" r="3" fill={accent} />
    </g>
  ),
  tire: (p, accent) => {
    const spokes: ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      spokes.push(
        <g key={i} transform={`rotate(${i * 72} 100 100)`}>
          <path d="M96 88 L92 56 h6 l2 30z" fill={p("metal")} />
          <path d="M104 88 L108 56 h-6 l-2 30z" fill={p("metal")} />
        </g>,
      );
    }
    return (
      <g>
        <circle cx="100" cy="100" r="76" fill="#121418" />
        <circle cx="100" cy="100" r="71" fill="none" stroke="#050607" strokeWidth="10" strokeDasharray="7 5" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#2a2e36" strokeWidth="2" />
        <circle cx="100" cy="100" r="57" fill="none" stroke={accent} strokeWidth="2.5" />
        <circle cx="100" cy="100" r="49" fill="#1a1d23" />
        <circle cx="100" cy="100" r="49" fill="none" stroke={p("metal")} strokeWidth="5" />
        {spokes}
        <circle cx="100" cy="100" r="15" fill={p("metal")} />
        <circle cx="100" cy="100" r="6" fill={accent} />
        <path d="M40 70a66 66 0 0 1 40-38" stroke="#fff" strokeOpacity=".12" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    );
  },
  shock: (p, accent) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const y = 54 + i * 10;
      pts.push(`78,${y}`, `122,${y + 5}`);
    }
    return (
      <g>
        <rect x="120" y="36" width="22" height="64" rx="9" fill={p("metal")} />
        <rect x="120" y="36" width="22" height="12" rx="5" fill={accent} />
        <path d="M120 60h-12" stroke={p("metal")} strokeWidth="6" />
        <rect x="94" y="32" width="12" height="70" fill={p("metal")} />
        <rect x="88" y="98" width="24" height="64" rx="4" fill={p("dark")} />
        <circle cx="100" cy="26" r="13" fill={p("metal")} />
        <circle cx="100" cy="26" r="5.5" fill="#0b0c0f" />
        <rect x="78" y="44" width="44" height="9" rx="2" fill={p("metal")} />
        <polyline points={pts.join(" ")} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts.join(" ")} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinejoin="round" transform="translate(0 -2)" />
        <rect x="78" y="152" width="44" height="9" rx="2" fill={p("metal")} />
        <circle cx="100" cy="176" r="12" fill={p("metal")} />
        <circle cx="100" cy="176" r="5" fill="#0b0c0f" />
      </g>
    );
  },
  perfume: (p, accent) => (
    <g>
      <rect x="80" y="26" width="40" height="40" rx="6" fill="#8a5a32" />
      <g stroke="#5d3b1f" strokeWidth="1.5" fill="none" opacity=".8">
        <path d="M86 30c4 10-2 20 2 32M98 28c-3 12 3 22 0 36M110 30c4 10-2 22 2 32" />
      </g>
      <rect x="88" y="64" width="24" height="14" fill={p("metal")} />
      <rect x="60" y="76" width="80" height="98" rx="20" fill="#ffffff" fillOpacity=".08" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      <rect x="66" y="106" width="68" height="62" rx="15" fill={accent} opacity=".85" />
      <rect x="66" y="106" width="68" height="62" rx="15" fill={p("shade")} />
      <g fill="#fff" opacity=".5">
        <circle cx="80" cy="150" r="3" />
        <circle cx="118" cy="130" r="2" />
        <circle cx="108" cy="156" r="2.5" />
      </g>
      <rect x="70" y="84" width="8" height="78" rx="4" fill="#fff" opacity=".28" />
      <rect x="80" y="118" width="40" height="22" rx="3" fill="#0b0c0f" opacity=".85" />
      <text x="100" y="128" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff" fontFamily="sans-serif" letterSpacing="1">KING ORI</text>
      <text x="100" y="136" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#a3aab6" fontFamily="sans-serif" letterSpacing="1">CAR PERFUME</text>
    </g>
  ),
  sprocket: (p, accent) => {
    const holes: ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      const [x, y] = polar(38, i * 72 - 90);
      holes.push(<circle key={i} cx={x} cy={y} r="12" fill="#101216" />);
    }
    const bolts: ReactNode[] = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = polar(11, i * 90 + 45);
      bolts.push(<circle key={i} cx={x} cy={y} r="2.5" fill="#0b0c0f" />);
    }
    const links: ReactNode[] = [];
    for (let i = 0; i < 15; i++) {
      const deg = 18 + i * 10;
      const [x, y] = polar(80, deg);
      links.push(
        <rect
          key={i}
          x={x - 6}
          y={y - 3.5}
          width="12"
          height="7"
          rx="3.5"
          fill={i % 2 ? "#5b616c" : "#c9ced8"}
          stroke="#0b0c0f"
          strokeWidth="1"
          transform={`rotate(${deg + 90} ${x} ${y})`}
        />,
      );
    }
    return (
      <g>
        <polygon points={gearPoints(30, 72, 63)} fill={accent} />
        <polygon points={gearPoints(30, 72, 63)} fill={p("shade")} />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#0b0c0f" strokeOpacity=".35" strokeWidth="2" />
        {holes}
        <circle cx="100" cy="100" r="18" fill={p("metal")} />
        <circle cx="100" cy="100" r="6" fill="#0b0c0f" />
        {bolts}
        {links}
      </g>
    );
  },
  cover: (p, accent) => (
    <g>
      <g fill="#2fd3ff" opacity=".8">
        <path d="M58 28c3 5 5 8 5 10a5 5 0 0 1-10 0c0-2 2-5 5-10z" />
        <path d="M112 16c3 5 5 8 5 10a5 5 0 0 1-10 0c0-2 2-5 5-10z" />
        <path d="M150 38c3 5 5 8 5 10a5 5 0 0 1-10 0c0-2 2-5 5-10z" />
      </g>
      <path d="M28 156c-2-32 14-50 36-54l20-28c8-10 24-12 36-8l32 10c14 4 22 16 22 32l4 48z" fill={p("dark")} />
      <path d="M28 156c-2-32 14-50 36-54l20-28c8-10 24-12 36-8l32 10c14 4 22 16 22 32l4 48z" fill={p("metal")} opacity=".35" />
      <g stroke="#fff" strokeOpacity=".18" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M70 108c10 10 12 28 6 44M118 80c-6 18 0 46 10 70M150 92c4 14 4 34 0 56" />
      </g>
      <path d="M28 156c40 6 100 6 150 0" stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="112" cy="108" r="13" fill="#0b0c0f" stroke={accent} strokeWidth="2.5" />
      <path d="M104 113l-1.5-9 4.5 3.5 5-6 5 6 4.5-3.5-1.5 9z" fill={accent} />
    </g>
  ),
};

export function ProductArt({
  kind,
  accent,
  className = "size-full",
}: {
  kind: ArtKind;
  accent: string;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (k: string) => `${uid}-${k}`;
  const paint: Paint = (k) => `url(#${id(k)})`;

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="0.45" stopColor="#a6adb9" />
          <stop offset="0.55" stopColor="#5f6672" />
          <stop offset="1" stopColor="#d8dce3" />
        </linearGradient>
        <linearGradient id={id("acc")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: mix(accent, "white", 70) }} />
          <stop offset="0.5" style={{ stopColor: accent }} />
          <stop offset="1" style={{ stopColor: mix(accent, "black", 60) }} />
        </linearGradient>
        <linearGradient id={id("shade")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={id("dark")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a404c" />
          <stop offset="1" stopColor="#0f1115" />
        </linearGradient>
        <radialGradient id={id("glass")} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#e0f7ff" />
          <stop offset="0.35" style={{ stopColor: mix(accent, "#1e3a8a", 45) }} />
          <stop offset="1" stopColor="#05070a" />
        </radialGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: accent }} stopOpacity="0.55" />
          <stop offset="1" style={{ stopColor: accent }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("floor")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="186" rx="70" ry="9" fill={`url(#${id("floor")})`} />
      {shapes[kind](paint, accent)}
    </svg>
  );
}
