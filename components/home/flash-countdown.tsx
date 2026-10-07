"use client";

import { pad2, splitDuration, useNow } from "@/lib/use-now";

export function FlashCountdown() {
  const now = useNow();
  let parts = ["--", "--", "--"];
  if (now) {
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const { hours, minutes, seconds } = splitDuration(end.getTime() - now);
    parts = [pad2(hours), pad2(minutes), pad2(seconds)];
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Sisa waktu promo">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="grid h-10 w-11 place-items-center rounded-lg bg-asphalt font-display text-xl font-bold text-hazard tabular-nums ring-1 ring-hazard/30">
            {p}
          </span>
          {i < 2 && <span className="font-bold text-hazard">:</span>}
        </span>
      ))}
    </div>
  );
}
