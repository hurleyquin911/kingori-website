// Ganti data di file ini dengan data asli toko sebelum website dipublikasikan.
export const store = {
  name: "King Ori",
  tagline: "Spare Part & Aksesoris Kendaraan 100% Original",
  whatsapp: "6282119199819",
  email: "admin@kingori.id",
  shopeeUrl: "https://shopee.co.id/king_ori",
  instagram: "https://instagram.com/kingori.id",
  address: "Jl. Otomotif Raya No. 88, Jakarta Timur, DKI Jakarta 13450",
  operationalHours: "Senin – Sabtu, 08.00 – 20.00 WIB",
  originProvince: "DKI Jakarta",
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
  color: string;
};

export const banks: Bank[] = [
  { id: "bca", name: "Bank Central Asia", short: "BCA", color: "#0060af" },
  { id: "mandiri", name: "Bank Mandiri", short: "Mandiri", color: "#f5a800" },
  { id: "bri", name: "Bank Rakyat Indonesia", short: "BRI", color: "#00529c" },
  { id: "bni", name: "Bank Negara Indonesia", short: "BNI", color: "#f15a23" },
];

export type EWallet = {
  id: string;
  name: string;
  short: string;
  color: string;
};

export const eWallets: EWallet[] = [
  { id: "dana", name: "DANA", short: "DANA", color: "#108ee9" },
  { id: "ovo", name: "OVO", short: "OVO", color: "#4c3494" },
  { id: "gopay", name: "GoPay", short: "GoPay", color: "#00aad4" },
  { id: "shopeepay", name: "ShopeePay", short: "ShopeePay", color: "#ee4d2d" },
  { id: "linkaja", name: "LinkAja", short: "LinkAja", color: "#e31e24" },
];
