"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useLayoutEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useHydrated } from "@/lib/local-store";
import { Icon } from "./icon";
import { Logo } from "./logo";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Katalog" },
  { href: "/dropship", label: "Dropship" },
  { href: "/#cara-belanja", label: "Cara Belanja" },
  { href: "/pesanan", label: "Cek Pesanan" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);
}

function DesktopLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="ml-6 hidden items-center gap-1 lg:flex">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`relative px-3 py-2 font-display text-sm font-semibold tracking-wider uppercase transition ${
              active ? "text-white" : "text-steel hover:text-white"
            }`}
          >
            {l.label}
            {active && (
              <span className="absolute inset-x-3 -bottom-[17px] h-0.5 bg-ignite shadow-[0_0_12px_#ff4a1c]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function ActiveDesktopLinks() {
  return <DesktopLinks pathname={usePathname()} />;
}

function MobileLinks({ pathname, onNavigate }: { pathname: string | null; onNavigate: () => void }) {
  return (
    <nav className="grid gap-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onNavigate={onNavigate}
          className={`flex items-center justify-between rounded-lg px-3 py-3 font-display font-semibold tracking-wider uppercase ${
            isActive(pathname, l.href) ? "bg-ignite/10 text-ignite" : "text-chrome hover:bg-white/5"
          }`}
        >
          {l.label}
          <Icon name="chevronRight" className="size-4" />
        </Link>
      ))}
    </nav>
  );
}

function ActiveMobileLinks({ onNavigate }: { onNavigate: () => void }) {
  return <MobileLinks pathname={usePathname()} onNavigate={onNavigate} />;
}

function SearchBox({
  value,
  onChange,
  className,
  inputClassName,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  inputClassName: string;
  placeholder: string;
}) {
  return (
    <label className={`relative block ${className ?? ""}`}>
      <span className="sr-only">Cari produk</span>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-dim" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </label>
  );
}

export function Navbar() {
  const router = useRouter();
  const { count } = useCart();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const close = () => setOpen(false);

  useLayoutEffect(() => () => setOpen(false), []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/produk?q=${encodeURIComponent(q)}` : "/produk");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-asphalt/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo onNavigate={close} />

        <Suspense fallback={<DesktopLinks pathname={null} />}>
          <ActiveDesktopLinks />
        </Suspense>

        <form onSubmit={submit} className="ml-auto hidden max-w-sm flex-1 md:block">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Cari helm, oli, kampas rem…"
            inputClassName="h-11 w-full rounded-xl border border-line bg-panel pr-4 pl-10 text-sm outline-none transition placeholder:text-dim focus:border-ignite focus:ring-4 focus:ring-ignite/15"
          />
        </form>

        <Link
          href="/keranjang"
          aria-label="Keranjang belanja"
          className="relative ml-auto grid size-11 place-items-center rounded-xl border border-line bg-panel transition hover:border-ignite md:ml-0"
        >
          <Icon name="cart" />
          {hydrated && count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-ignite px-1 text-[11px] leading-5 font-bold text-white ring-2 ring-asphalt">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>

        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid size-11 place-items-center rounded-xl border border-line bg-panel lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-asphalt lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
            <form onSubmit={submit} className="md:hidden">
              <SearchBox value={query} onChange={setQuery} placeholder="Cari spare part…" inputClassName="field pl-10" />
            </form>
            <Suspense fallback={<MobileLinks pathname={null} onNavigate={close} />}>
              <ActiveMobileLinks onNavigate={close} />
            </Suspense>
          </div>
        </div>
      )}
    </header>
  );
}
