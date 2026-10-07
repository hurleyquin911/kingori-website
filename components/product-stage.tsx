import type { ArtKind } from "@/lib/products";
import { ProductArt } from "./product-art";

export function ProductStage({
  kind,
  accent,
  className = "",
  artClassName = "size-[78%]",
  watermark = true,
}: {
  kind: ArtKind;
  accent: string;
  className?: string;
  artClassName?: string;
  watermark?: boolean;
}) {
  return (
    <div
      className={`relative isolate flex items-center justify-center overflow-hidden bg-carbon ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 38%, color-mix(in srgb, ${accent} 26%, transparent), transparent 62%), linear-gradient(180deg, #171a20 0%, #0b0c0f 100%)`,
      }}
    >
      <div className="grid-lines absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      {watermark && (
        <span className="pointer-events-none absolute -bottom-3 left-1/2 -z-10 -translate-x-1/2 font-display text-[5.5rem] leading-none font-bold whitespace-nowrap text-white/[0.03] italic select-none">
          KING ORI
        </span>
      )}
      <ProductArt kind={kind} accent={accent} className={`${artClassName} drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)]`} />
    </div>
  );
}
