const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number) {
  return rupiah.format(value).replace(/\u00a0/g, " ");
}

export function formatCompact(value: number) {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k >= 10 ? Math.floor(k) : k.toFixed(1).replace(".0", "")}rb+`;
  }
  return String(value);
}

export function discountPercent(price: number, original?: number) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}
