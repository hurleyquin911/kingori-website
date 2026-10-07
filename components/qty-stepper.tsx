"use client";

import { Icon } from "./icon";

export function QtyStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center rounded-lg border border-line-2 bg-carbon">
      <button
        type="button"
        aria-label="Kurangi jumlah"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="grid size-9 place-items-center text-steel hover:text-white disabled:opacity-30"
      >
        <Icon name="minus" className="size-3.5" />
      </button>
      <span className="w-8 text-center font-display font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid size-9 place-items-center text-steel hover:text-white disabled:opacity-30"
      >
        <Icon name="plus" className="size-3.5" />
      </button>
    </div>
  );
}
