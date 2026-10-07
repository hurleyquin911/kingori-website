import type { SVGProps } from "react";

const paths = {
  cart: (
    <>
      <path d="M3 3h2.2l2.4 12.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L21.8 8H6.1" />
      <circle cx="10" cy="20.5" r="1.3" />
      <circle cx="18" cy="20.5" r="1.3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  star: (
    <path
      d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"
      fill="currentColor"
      stroke="none"
    />
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.8 12 2.2 2.2 4.4-4.4" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a4.6 4.6 0 0 1-2.3-2.3l.9-1-1-2z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5 12 4l9 5.5M4.5 10v8M9.5 10v8M14.5 10v8M19.5 10v8M3 20.5h18" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1" />
      <path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 19.5h2M19.5 14v2" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4m-5 5 5-5 5 5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor" stroke="none" />,
  package: (
    <>
      <path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5V18a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-1.5zM4 7.5A2.5 2.5 0 0 1 6.5 5H17v4" />
      <circle cx="16" cy="14.5" r="1.2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.2" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5V20h16V9.5M3 9.5 5 4h14l2 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  wrench: (
    <path d="M14.5 6.5a4 4 0 0 0 5.2 5.2l-8.6 8.6a2.2 2.2 0 0 1-3.1-3.1l8.6-8.6a4 4 0 0 1 5.2-5.2l-2.6 2.6.5 2.1 2.1.5z" />
  ),
  filter: <path d="M4 5h16l-6.2 7.5V19l-3.6 1.5v-8z" />,
  download: (
    <>
      <path d="M12 4v12m-5-5 5 5 5-5" />
      <path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5.5 9.5V20h13V9.5" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-2v18M12 8h8v13" />
      <path d="M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2M2 21h20" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13.5" width="4" height="6" rx="1.5" />
      <rect x="17" y="13.5" width="4" height="6" rx="1.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-5",
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
