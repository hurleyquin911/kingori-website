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
  shippingLabel: string;
  shippingEta: string;
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

export function paymentChoiceLabel(method: PaymentMethod, bankId: string | null, walletId: string | null) {
  if (method === "transfer") {
    const bank = banks.find((b) => b.id === bankId);
    return bank ? `Transfer Bank ${bank.short}` : "Transfer Bank";
  }
  const wallet = eWallets.find((w) => w.id === walletId);
  return wallet ? `E-wallet ${wallet.name}` : "E-wallet";
}

export function buildOrderWhatsAppMessage(order: OrderPayload) {
  const items = order.lines.map((l, i) => {
    const variant = l.variant ? ` (${l.variant})` : "";
    return `${i + 1}. ${l.name}${variant}\n    ${l.qty} × ${formatRupiah(l.price)} = ${formatRupiah(l.lineTotal)}`;
  });

  const addr = [
    `${order.address.street}`,
    `${order.address.village}, ${order.address.district}`,
    `${order.address.city}, ${order.address.province} ${order.address.postalCode}`,
    order.address.landmark ? `Patokan: ${order.address.landmark}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const payment = paymentChoiceLabel(order.payment.method, order.payment.bankId, order.payment.walletId);
  const paymentAsk =
    order.payment.method === "transfer"
      ? `Mohon kirim nomor rekening ${banks.find((b) => b.id === order.payment.bankId)?.short ?? "bank"} King Ori untuk pembayaran.`
      : `Mohon kirim nomor ${eWallets.find((w) => w.id === order.payment.walletId)?.name ?? "e-wallet"} King Ori untuk pembayaran.`;

  const lines: (string | null)[] = [
    `Halo admin ${store.name}, saya mau order.`,
    "",
    "*DATA BARANG*",
    ...items,
    "",
    `Subtotal: ${formatRupiah(order.subtotal)}`,
    `Ongkir (${order.shippingLabel}): ${order.shippingCost ? formatRupiah(order.shippingCost) : "Gratis"}`,
    order.shippingDiscount > 0 ? `Diskon ongkir: -${formatRupiah(order.shippingDiscount)}` : null,
    order.insuranceCost > 0 ? `Asuransi: ${formatRupiah(order.insuranceCost)}` : null,
    `*TOTAL: ${formatRupiah(order.total)}*`,
    "",
    "*PENERIMA*",
    `Nama: ${order.customer.name}`,
    `WhatsApp: ${order.customer.phone}`,
    order.customer.email ? `Email: ${order.customer.email}` : null,
    `Label: ${order.address.label}`,
    addr,
    "",
    "*PENGIRIMAN*",
    order.shippingLabel,
    `Estimasi: ${order.shippingEta}`,
    "",
    "*METODE PEMBAYARAN*",
    payment,
    paymentAsk,
  ];

  if (order.dropship) {
    lines.push(
      "",
      "*PESANAN DROPSHIP*",
      `Pengirim: ${order.dropship.name}`,
      `HP pengirim: ${order.dropship.phone}`,
      order.dropship.shop ? `Toko: ${order.dropship.shop}` : null,
      "Mohon kirim tanpa nota / harga King Ori di dalam paket.",
    );
  }

  if (order.note) {
    lines.push("", "*CATATAN*", order.note);
  }

  lines.push("", "Mohon konfirmasi ketersediaan & kirim nomor pembayaran. Terima kasih!");

  return lines.filter((l): l is string => l !== null).join("\n");
}

export function orderWhatsAppUrl(message: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}
