import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaPath = join(root, "data/mass_update_media_info_259153843_20261018122622.xlsx");
const salesPath = join(root, "data/mass_update_sales_info_259153843_20261018122444.xlsx");
const outPath = join(root, "lib/products-data.json");

const ACCENTS = ["#ff4a1c", "#2fd3ff", "#ffc414", "#a3aab6", "#c9b38a", "#e1b54a", "#4b5563"];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "") || "produk";
}

function mapCategory(catRaw) {
  const c = String(catRaw || "").toLowerCase();
  if (c.includes("keychain") || c.includes("key cover") || c.includes("keychains")) return "gantungan-sarung-kunci";
  if (c.includes("automotive tools") || c.includes("tire pressure")) return "perkakas-kelengkapan";
  if (c.includes("cables") || c.includes("chargers") || c.includes("converters") || c.includes("docks & stands")) {
    return "kabel-charger-konverter";
  }
  if (c.includes("automobile exterior") || c.includes("mud flaps") && c.includes("automobile")) {
    return "aksesoris-eksterior-mobil";
  }
  if (c.includes("automobile interior")) return "aksesoris-interior-mobil";
  if (c.includes("motorcycle accessories") || c.includes("motorcycle/accessories")) return "aksesoris-sepeda-motor";
  if (c.includes("automobile spare") || c.includes("automobile/automobile spare")) return "suku-cadang-mobil";
  if (c.includes("motorcycle spare") || c.includes("motorcycle/motorcycle spare")) return "suku-cadang-motor";
  if (c.includes("automobiles/") && c.includes("exterior")) return "aksesoris-eksterior-mobil";
  if (c.includes("automobiles/") && c.includes("interior")) return "aksesoris-interior-mobil";
  if (c.includes("motorcycles/") && c.includes("accessories")) return "aksesoris-sepeda-motor";
  if (c.includes("motorcycles/") && c.includes("spare")) return "suku-cadang-motor";
  return "otomotif-lainnya";
}

function artForCategory(id) {
  const map = {
    "aksesoris-eksterior-mobil": "cover",
    "aksesoris-interior-mobil": "perfume",
    "aksesoris-sepeda-motor": "helmet",
    "suku-cadang-mobil": "brake",
    "suku-cadang-motor": "sprocket",
    "gantungan-sarung-kunci": "gloves",
    "perkakas-kelengkapan": "sparkplug",
    "kabel-charger-konverter": "charger",
    "otomotif-lainnya": "tire",
  };
  return map[id] ?? "tire";
}

function weightForCategory(id) {
  const map = {
    "aksesoris-eksterior-mobil": 600,
    "aksesoris-interior-mobil": 400,
    "aksesoris-sepeda-motor": 500,
    "suku-cadang-mobil": 1200,
    "suku-cadang-motor": 800,
    "gantungan-sarung-kunci": 80,
    "perkakas-kelengkapan": 900,
    "kabel-charger-konverter": 200,
    "otomotif-lainnya": 400,
  };
  return map[id] ?? 500;
}

function firstDataRow(rows) {
  for (let i = 0; i < rows.length; i++) {
    if (/^\d+$/.test(String(rows[i][0] ?? "").trim())) return i;
  }
  return -1;
}

/** Kolom foto Shopee: URL penuh https://cf.shopee.co.id/file/... */
function normalizeImageUrl(raw) {
  const v = String(raw ?? "").trim();
  if (!v) return undefined;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return undefined;
}

function collectImages(row) {
  const imgs = [];
  for (let i = 4; i <= 12; i++) {
    const v = normalizeImageUrl(row[i]);
    if (v) imgs.push(v);
  }
  return [...new Set(imgs)];
}

/**
 * Media export Shopee:
 * 15 = nama dimensi (Warna/Varian/…)
 * 16/17 = opsi1 + foto, 18/19 = opsi2 + foto, … sampai opsi9 di 32/33
 */
function collectVariantOptions(row) {
  const label = String(row[15] ?? "").trim() || "Varian";
  const options = [];
  for (let i = 16; i <= 32; i += 2) {
    const name = String(row[i] ?? "").trim();
    if (!name) continue;
    options.push({ label: name, image: normalizeImageUrl(row[i + 1]) });
  }
  return { label, options };
}

/** Cocokkan nama SKU sales ke opsi media (yang punya foto). */
function matchOptionImage(label, mediaOptions) {
  const lower = String(label ?? "")
    .toLowerCase()
    .trim();
  if (!lower || !mediaOptions?.length) return undefined;

  const opts = mediaOptions
    .map((o) => ({ label: o.label, image: o.image, ol: o.label.toLowerCase().trim() }))
    .filter((o) => o.ol);

  const exact = opts.find((o) => o.ol === lower && o.image);
  if (exact) return exact.image;

  // Urut panjang → pendek supaya "Premium Carbon" menang atas "Carbon"
  const ranked = [...opts].sort((a, b) => b.ol.length - a.ol.length);
  for (const o of ranked) {
    if (!o.image) continue;
    if (lower === o.ol || lower.startsWith(`${o.ol},`) || lower.endsWith(`,${o.ol}`) || lower.endsWith(`, ${o.ol}`)) {
      return o.image;
    }
  }

  // Kombo "Kiri,Hitam" — cocokkan tiap segmen ke opsi berfoto
  const parts = lower
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const part of parts) {
    const hit = ranked.find((o) => o.ol === part && o.image);
    if (hit) return hit.image;
  }

  return undefined;
}

function salesMatchesOption(salesName, optionLabel) {
  const sl = salesName.toLowerCase().trim();
  const ol = optionLabel.toLowerCase().trim();
  return sl === ol || sl.startsWith(`${ol},`) || sl.endsWith(`,${ol}`) || sl.endsWith(`, ${ol}`);
}

function buildVariants(mediaOptions, salesNamed, basePrice, baseStock) {
  const salesNames = [...new Set(salesNamed.map((s) => s.variationName).filter(Boolean))];

  function priceStock(predicate, splitBy = Math.max(salesNames.length, mediaOptions.length, 1)) {
    const rows = salesNamed.filter(predicate);
    if (!rows.length) {
      return {
        price: basePrice,
        stock: Math.max(0, Math.floor(baseStock / splitBy)),
      };
    }
    return {
      price: Math.min(...rows.map((r) => r.price)),
      stock: rows.reduce((n, r) => n + r.stock, 0),
    };
  }

  // Sales punya beberapa SKU — pakai nama sales (harga/stok akurat), foto dari kolom media
  if (salesNames.length > 1) {
    const mediaCoversSales =
      mediaOptions.length > 1 &&
      salesNames.length === mediaOptions.length &&
      mediaOptions.every((o) => salesNames.some((s) => salesMatchesOption(s, o.label))) &&
      salesNames.every((s) => mediaOptions.some((o) => salesMatchesOption(s, o.label)));

    // 1 opsi media ↔ 1 SKU sales (sering "Hitam,Original") → tampilkan nama bersih + fotonya
    if (mediaCoversSales) {
      return mediaOptions.map((o) => {
        const { price, stock } = priceStock((s) => salesMatchesOption(s.variationName, o.label));
        return { label: o.label, image: o.image, price, stock };
      });
    }

    return salesNames.map((label) => {
      const { price, stock } = priceStock((s) => s.variationName === label);
      return { label, image: matchOptionImage(label, mediaOptions), price, stock };
    });
  }

  // Tidak ada nama di sales, tapi media punya opsi (+ foto)
  if (mediaOptions.length > 1) {
    return mediaOptions.map((o) => {
      const { price, stock } = priceStock(() => false, mediaOptions.length);
      return { label: o.label, image: o.image, price, stock };
    });
  }

  if (salesNames.length === 1) {
    const label = salesNames[0];
    const { price, stock } = priceStock((s) => s.variationName === label);
    return [{ label, image: matchOptionImage(label, mediaOptions), price, stock }];
  }

  return [];
}

function sheetRows(path) {
  const wb = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: "" });
}

const mediaRows = sheetRows(mediaPath);
const salesRows = sheetRows(salesPath);
const mediaStart = firstDataRow(mediaRows);
const salesStart = firstDataRow(salesRows);

const mediaById = new Map();
for (const row of mediaRows.slice(mediaStart)) {
  const id = String(row[0] ?? "").trim();
  if (!/^\d+$/.test(id)) continue;
  const name = String(row[2] ?? "").trim();
  if (!name) continue;
  const images = collectImages(row);
  const { label: variantLabel, options } = collectVariantOptions(row);
  mediaById.set(id, {
    id,
    name,
    shopeeCategory: String(row[3] ?? "").trim(),
    images,
    variantLabel,
    mediaOptions: options,
  });
}

const salesById = new Map();
for (const row of salesRows.slice(salesStart)) {
  const id = String(row[0] ?? "").trim();
  if (!/^\d+$/.test(id)) continue;
  if (!salesById.has(id)) salesById.set(id, []);
  const vname = String(row[3] ?? "").trim();
  const price = Number(row[6]);
  const stock = Number(row[8]);
  salesById.get(id).push({
    variationId: String(row[2] ?? ""),
    variationName: vname,
    price: Number.isFinite(price) ? price : 0,
    stock: Number.isFinite(stock) ? stock : 0,
  });
}

const usedSlugs = new Set();
const products = [];
let skipped = 0;

for (const [id, media] of mediaById) {
  const sales = salesById.get(id) ?? [];
  const priced = sales.filter((s) => s.price > 0);
  if (!priced.length && !media.images.length) {
    skipped++;
    continue;
  }
  const prices = priced.map((s) => s.price);
  const price = prices.length ? Math.min(...prices) : 0;
  if (!price) {
    skipped++;
    continue;
  }
  const stock = priced.reduce((n, s) => n + s.stock, 0);
  const category = mapCategory(media.shopeeCategory);

  const salesNamed = priced.filter((s) => s.variationName);
  const variants = buildVariants(media.mediaOptions, salesNamed, price, stock);

  // Gabungkan foto opsi variasi ke galeri produk (dari kolom Foto Variasi Excel)
  const images = [...media.images];
  for (const o of media.mediaOptions) {
    if (o.image && !images.includes(o.image)) images.push(o.image);
  }
  for (const v of variants) {
    if (v.image && !images.includes(v.image)) images.push(v.image);
  }

  let slug = slugify(media.name);
  if (usedSlugs.has(slug)) slug = `${slug}-${id.slice(-6)}`;
  usedSlugs.add(slug);

  const accent = ACCENTS[products.length % ACCENTS.length];
  const image = images[0] ?? null;
  const highlights = [
    "Produk dari toko resmi King Ori di Shopee",
    "Dikemas aman sebelum dikirim",
    "Checkout & konfirmasi via WhatsApp",
  ];
  if (variants.length > 1) highlights.unshift(`Tersedia ${variants.length} pilihan varian`);

  const variantPayload =
    variants.length > 0
      ? variants.map(({ label, image: vi, price: vp, stock: vs }) => ({
          label,
          ...(vi ? { image: vi } : {}),
          ...(typeof vp === "number" ? { price: vp } : {}),
          ...(typeof vs === "number" ? { stock: vs } : {}),
        }))
      : undefined;

  products.push({
    id,
    slug,
    name: media.name,
    category,
    art: artForCategory(category),
    accent,
    image,
    images,
    price,
    rating: 4.8,
    reviews: 0,
    sold: 0,
    stock: Math.max(stock, 0),
    weight: weightForCategory(category),
    brand: "King Ori",
    compatibility: "Cek kesesuaian di deskripsi / chat admin",
    variantLabel: variantPayload?.length ? media.variantLabel || "Varian" : undefined,
    variants: variantPayload,
    badges: stock > 0 ? ["Original"] : ["Habis"],
    flashSale: false,
    isNew: false,
    description: `${media.name}. Produk original dari King Ori — suku cadang & aksesoris kendaraan. Stok siap kirim, checkout via WhatsApp.`,
    highlights,
    specs: [
      ["Kode Shopee", id],
      ["Kategori Shopee", media.shopeeCategory.split(" - ").slice(1).join(" / ") || media.shopeeCategory],
      ["Stok", String(stock)],
      ...(variantPayload && variantPayload.length > 1
        ? [["Jumlah Varian", String(variantPayload.length)]]
        : []),
    ],
    shopeeCategory: media.shopeeCategory,
  });
}

products.sort((a, b) => a.name.localeCompare(b.name, "id"));

// Mark some flash / new for homepage variety
products.slice(0, 8).forEach((p) => {
  p.flashSale = true;
});
products.slice(8, 16).forEach((p) => {
  p.isNew = true;
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(products, null, 2));

const byCat = {};
for (const p of products) byCat[p.category] = (byCat[p.category] || 0) + 1;
const multi = products.filter((p) => (p.variants?.length ?? 0) > 1);
const withVarImg = multi.filter((p) => p.variants.every((v) => v.image));
const noVarImg = multi.filter((p) => p.variants.every((v) => !v.image));
console.log(`Imported ${products.length} products (skipped ${skipped})`);
console.log(`Multi-varian: ${multi.length} | semua berfoto: ${withVarImg.length} | tanpa foto opsi di Excel: ${noVarImg.length}`);
console.log("By category:");
for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`);
console.log(`Wrote ${outPath}`);
