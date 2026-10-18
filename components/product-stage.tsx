/* eslint-disable @next/next/no-img-element */
import type { ArtKind } from "@/lib/products";
import { ProductArt } from "./product-art";

export function ProductStage({
  kind,
  accent,
  image,
  className = "",
  artClassName = "size-[78%]",
  imageClassName,
  watermark = true,
}: {
  kind: ArtKind;
  accent: string;
  image?: string | null;
  className?: string;
  artClassName?: string;
  imageClassName?: string;
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
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className={`relative z-0 object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] ${imageClassName ?? "size-[88%] p-3"}`}
        />
      ) : (
        <ProductArt kind={kind} accent={accent} className={`${artClassName} drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)]`} />
      )}
    </div>
  );
}
