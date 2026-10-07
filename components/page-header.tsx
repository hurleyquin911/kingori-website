import Link from "next/link";
import { Icon } from "./icon";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  compact = false,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  crumbs: { label: string; href?: string }[];
  compact?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div className="carbon absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(255,74,28,0.22),transparent_55%)]" />
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${compact ? "py-5" : "py-10 sm:py-12"}`}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-dim">
          <Link href="/" className="flex items-center gap-1 hover:text-white">
            <Icon name="home" className="size-3.5" /> Beranda
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <Icon name="chevronRight" className="size-3" />
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-steel">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        {!compact && (
          <>
            <p className="mt-5 font-display text-sm font-semibold tracking-[0.3em] text-ignite uppercase">{eyebrow}</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-wide text-white uppercase italic sm:text-4xl">
              {title}
            </h1>
            {description && <p className="mt-2 max-w-2xl text-steel">{description}</p>}
          </>
        )}
      </div>
    </section>
  );
}
