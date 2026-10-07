import Link from "next/link";

export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ko-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc414" />
          <stop offset="0.55" stopColor="#ff4a1c" />
          <stop offset="1" stopColor="#d4163c" />
        </linearGradient>
      </defs>
      <path d="M24 2 43 13v22L24 46 5 35V13z" fill="url(#ko-mark)" />
      <path d="M24 6.5 39.2 15.3v17.4L24 41.5 8.8 32.7V15.3z" fill="#0b0c0f" />
      <path
        d="M13.5 30.5 12 18l6.2 5L24 14l5.8 9 6.2-5-1.5 12.5z"
        fill="url(#ko-mark)"
      />
      <rect x="13.5" y="32.2" width="21" height="3" rx="1" fill="#ffc414" />
    </svg>
  );
}

export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onNavigate={onNavigate} className="group flex items-center gap-2.5">
      <LogoMark className="size-10 transition group-hover:rotate-[-8deg]" />
      <span className="leading-none">
        <span className="block font-display text-xl font-bold tracking-wider uppercase italic">
          King<span className="text-ignite">Ori</span>
        </span>
        <span className="block text-[10px] font-semibold tracking-[0.25em] text-steel uppercase">
          Parts &amp; Accessories
        </span>
      </span>
    </Link>
  );
}
