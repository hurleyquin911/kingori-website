// Ganti data di file ini dengan data asli toko sebelum website dipublikasikan.
export const store = {
  name: "King Ori",
  tagline: "Spare Part & Aksesoris Kendaraan 100% Original",
  whatsapp: "6281234567890",
  email: "admin@kingori.id",
  shopeeUrl: "https://shopee.co.id/king_ori",
  instagram: "https://instagram.com/kingori.id",
  address: "Jl. Otomotif Raya No. 88, Jakarta Timur, DKI Jakarta 13450",
  operationalHours: "Senin – Sabtu, 08.00 – 20.00 WIB",
  originProvince: "DKI Jakarta",
  paymentDeadlineHours: 24,
  freeShippingMin: 300_000,
  freeShippingMaxDiscount: 20_000,
};

export const dropship = {
  registrationFee: 0,
  platforms: ["Shopee", "Tokopedia", "TikTok Shop", "Lazada", "Instagram", "WhatsApp", "Facebook", "Lainnya"],
};

export type Bank = {
  id: string;
  name: string;
  short: string;
  accountNumber: string;
  accountName: string;
  color: string;
};

export const banks: Bank[] = [
  { id: "bca", name: "Bank Central Asia", short: "BCA", accountNumber: "1234567890", accountName: "KING ORI OTOMOTIF", color: "#0060af" },
  { id: "mandiri", name: "Bank Mandiri", short: "Mandiri", accountNumber: "1230009876543", accountName: "KING ORI OTOMOTIF", color: "#f5a800" },
  { id: "bri", name: "Bank Rakyat Indonesia", short: "BRI", accountNumber: "012301000123456", accountName: "KING ORI OTOMOTIF", color: "#00529c" },
  { id: "bni", name: "Bank Negara Indonesia", short: "BNI", accountNumber: "0987654321", accountName: "KING ORI OTOMOTIF", color: "#f15a23" },
];

export const qris = {
  merchantName: "KING ORI OTOMOTIF",
  nmid: "ID1026XXXXXXXXX",
  // Simpan gambar QRIS asli di /public (mis. /public/qris.png) lalu isi path-nya di sini.
  image: null as string | null,
  supported: ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja", "m-Banking"],
};
