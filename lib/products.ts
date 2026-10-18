import rawProducts from "./products-data.json";

export type ArtKind =
  | "helmet"
  | "headlight"
  | "mirror"
  | "oil"
  | "brake"
  | "sparkplug"
  | "gloves"
  | "phoneholder"
  | "charger"
  | "tire"
  | "shock"
  | "perfume"
  | "sprocket"
  | "cover";

export type Category = {
  id: string;
  name: string;
  art: ArtKind;
  blurb: string;
};

export type Variant = {
  label: string;
  accent?: string;
  image?: string;
  price?: number;
  stock?: number;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  art: ArtKind;
  accent: string;
  image?: string | null;
  images?: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  weight: number;
  brand: string;
  compatibility: string;
  variantLabel?: string;
  variants?: Variant[];
  badges?: string[];
  flashSale?: boolean;
  isNew?: boolean;
  description: string;
  highlights: string[];
  specs: [string, string][];
  shopeeCategory?: string;
};

export const categories: Category[] = [
  { id: "aksesoris-eksterior-mobil", name: "Aksesoris Eksterior Mobil", art: "cover", blurb: "Cover spion, garnish, stiker, body" },
  { id: "aksesoris-interior-mobil", name: "Aksesoris Interior Mobil", art: "perfume", blurb: "Dashboard, jok, karpet, cover stir" },
  { id: "aksesoris-sepeda-motor", name: "Aksesoris Sepeda Motor", art: "helmet", blurb: "Spion, cover, stiker, holder" },
  { id: "suku-cadang-mobil", name: "Suku Cadang Mobil", art: "brake", blurb: "Rem, filter, lampu, body part" },
  { id: "suku-cadang-motor", name: "Suku Cadang Motor", art: "sprocket", blurb: "Rem, lampu, mesin, body" },
  { id: "gantungan-sarung-kunci", name: "Gantungan & Sarung Kunci Kendaraan", art: "gloves", blurb: "Gantungan, sarung remote" },
  { id: "perkakas-kelengkapan", name: "Perkakas & Kelengkapan Kendaraan", art: "sparkplug", blurb: "Tool, detector, kelengkapan" },
  { id: "kabel-charger-konverter", name: "Kabel, Charger, & Konverter", art: "charger", blurb: "USB, dock, charger" },
  { id: "otomotif-lainnya", name: "Otomotif Lainnya", art: "tire", blurb: "Produk otomotif lain" },
];

export const products: Product[] = rawProducts as Product[];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getVariant(product: Product, variant?: string | null) {
  if (!variant) return undefined;
  return product.variants?.find((v) => v.label === variant);
}

export function variantAccent(product: Product, variant?: string | null) {
  return getVariant(product, variant)?.accent ?? product.accent;
}

export function productImage(product: Product, variant?: string | null) {
  const fromVariant = getVariant(product, variant)?.image;
  if (fromVariant) return fromVariant;
  return product.image || product.images?.[0] || null;
}

export function variantPrice(product: Product, variant?: string | null) {
  return getVariant(product, variant)?.price ?? product.price;
}

export function variantStock(product: Product, variant?: string | null) {
  const v = getVariant(product, variant);
  if (typeof v?.stock === "number") return v.stock;
  return product.stock;
}

export function hasMultipleVariants(product: Product) {
  return (product.variants?.length ?? 0) > 1;
}

export function priceLabel(product: Product) {
  if (!product.variants?.length) return product.price;
  const prices = product.variants.map((v) => v.price ?? product.price);
  return Math.min(...prices);
}
