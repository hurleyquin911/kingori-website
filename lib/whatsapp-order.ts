import { formatRupiah } from "./format";
import { banks, eWallets, store } from "./store-config";

export type PaymentMethod = "transfer" | "ewallet";

type OrderLine = {
  name: string;
  variant: string | null;
  qty: number;
  price: number;
  lineTotal: number;
};

type OrderPayload = {
  lines: OrderLine[];
  subtotal: number;
  shippingCourier: string;
  shippingService: string;
  shippingEta: string;
  shippingWeightKg: number;
  shippingCost: number;
  shippingDiscount: number;
  insuranceCost: number;
  total: number;
  customer: { name: string; phone: string; email: string };
  address: {
    label: string;
    street: string;
    village: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    landmark: string;
  };
  dropship: { name: string; phone: string; shop: string } | null;
  payment: { method: PaymentMethod; bankId: string | null; walletId: string | null };
  note: string;
};

const LINE = "────────────────────";

function heading(emoji: string, title: string) {
  return ["", LINE, `${emoji} *${title}*`, LINE];
}

function field(label: string, value: string) {
  return `${label}: ${value}`;
}

export function paymentChoiceLabel(method: PaymentMethod, bankId: string | null, walletId: string | null) {
  if (method === "transfer") {
    const bank = banks.find((b) => b.id === bankId);
    return bank ? `Transfer Bank ${bank.short}` : "Transfer Bank";
  }
  const wallet = eWallets.find((w) => w.id === walletId);
  return wallet ? `E-wallet ${wallet.name}` : "E-wallet";
}

export function buildOrderWhatsAppMessage(order: OrderPayload) {
  const items = order.lines.flatMap((l, i) => {
    const rows = [`*${i + 1}.* ${l.name}`];
    if (l.variant) rows.push(`     Varian: ${l.variant}`);
    rows.push(`     ${l.qty} × ${formatRupiah(l.price)} = *${formatRupiah(l.lineTotal)}*`);
    if (i < order.lines.length - 1) rows.push("");
    return rows;
  });

  const addressLines = [
    order.address.street,
    `${order.address.village}, ${order.address.district}`,
    `${order.address.city}, ${order.address.province} ${order.address.postalCode}`,
    order.address.landmark ? `Patokan: ${order.address.landmark}` : null,
  ].filter((l): l is string => !!l);

  const bank = banks.find((b) => b.id === order.payment.bankId);
  const wallet = eWallets.find((w) => w.id === order.payment.walletId);
  const payment = paymentChoiceLabel(order.payment.method, order.payment.bankId, order.payment.walletId);
  const paymentAsk =
    order.payment.method === "transfer"
      ? `Mohon kirim *nomor rekening ${bank?.short ?? "bank"}* a.n. ${store.name} ke chat ini.`
      : `Mohon kirim *nomor ${wallet?.name ?? "e-wallet"}* ${store.name} ke chat ini.`;

  const shippingName = `${order.shippingCourier} ${order.shippingService}`.trim();

  const lines: (string | null)[] = [
    `Halo Admin *${store.name}* 👋`,
    "Saya mau order, mohon dicek ketersediaan & totalnya ya.",
    ...heading("📦", "DATA BARANG"),
    ...items,
    ...heading("💰", "RINGKASAN"),
    field("Subtotal", formatRupiah(order.subtotal)),
    field(`Ongkir (${shippingName}, ${order.shippingWeightKg} kg)`, order.shippingCost ? formatRupiah(order.shippingCost) : "Gratis"),
    order.shippingDiscount > 0 ? field("Diskon ongkir", `-${formatRupiah(order.shippingDiscount)}`) : null,
    order.insuranceCost > 0 ? field("Asuransi", formatRupiah(order.insuranceCost)) : null,
    field("*TOTAL*", `*${formatRupiah(order.total)}*`),
    ...heading("📍", "PENERIMA"),
    field("Nama", order.customer.name),
    field("WhatsApp", order.customer.phone),
    order.customer.email ? field("Email", order.customer.email) : null,
    field("Label", order.address.label),
    "Alamat:",
    ...addressLines.map((l) => `     ${l}`),
    ...heading("🚚", "PENGIRIMAN"),
    field("Kurir", shippingName),
    field("Berat", `${order.shippingWeightKg} kg`),
    field("Estimasi", order.shippingEta),
    ...heading("💳", "PEMBAYARAN"),
    field("Metode", payment),
    paymentAsk,
  ];

  if (order.dropship) {
    lines.push(
      ...heading("📦", "DROPSHIP"),
      field("Pengirim", order.dropship.name),
      field("HP pengirim", order.dropship.phone),
      order.dropship.shop ? field("Toko", order.dropship.shop) : null,
      "Mohon kirim *tanpa nota / harga King Ori* di dalam paket.",
    );
  }

  if (order.note) {
    lines.push(...heading("📝", "CATATAN"), order.note);
  }

  lines.push("", LINE, "Mohon konfirmasi stok & kirim nomor pembayaran.", "Terima kasih 🙏");

  return lines.filter((l): l is string => l !== null).join("\n");
}

export function orderWhatsAppUrl(message: string) {
  const text = encodeURIComponent(message).replace(/%0D%0A/gi, "%0a").replace(/%0A/g, "%0a");
  return `https://wa.me/${store.whatsapp}?text=${text}`;
}
