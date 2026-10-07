import Link from "next/link";
import { discountPercent, formatCompact, formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/products";
import { Icon } from "./icon";
import { ProductStage } from "./product-stage";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition duration-300 hover:-translate-y-1 hover:border-ignite/60 hover:shadow-[0_20px_50px_-20px_rgba(255,74,28,0.45)]">
      <Link href={`/produk/${product.slug}`} className="relative block">
        <ProductStage
          kind={product.art}
          accent={product.accent}
          watermark={false}
          className="aspect-square"
          artClassName="size-[74%] transition duration-500 group-hover:scale-110 group-hover:-rotate-3"
        />
        {discount > 0 && (
          <span className="skew-cut absolute top-3 left-0 bg-ignite py-1 pr-4 pl-3 font-display text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {product.isNew && (
            <span className="rounded-md bg-nitro px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-asphalt uppercase">
              Baru
            </span>
          )}
          {product.badges?.slice(0, 1).map((b) => (
            <span
              key={b}
              className="rounded-md border border-hazard/40 bg-asphalt/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-hazard uppercase backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/produk/${product.slug}`}
          className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-chrome transition group-hover:text-white"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-steel">
          <span className="flex items-center gap-1 text-hazard">
            <Icon name="star" className="size-3.5" />
            <span className="font-bold">{product.rating.toFixed(1)}</span>
          </span>
          <span className="h-3 w-px bg-line-2" />
          <span>{formatCompact(product.sold)} terjual</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-dim line-through">{formatRupiah(product.originalPrice)}</p>
            )}
            <p className="font-display text-lg leading-tight font-bold text-ignite">
              {formatRupiah(product.price)}
            </p>
          </div>
          <QuickAdd product={product} />
        </div>
      </div>
    </article>
  );
}
