import { store } from "./store-config";

type Zone = 1 | 2 | 3;

const provinceZones: Record<string, Zone> = {
  "DKI Jakarta": 1,
  Banten: 1,
  "Jawa Barat": 1,
  "Jawa Tengah": 1,
  "DI Yogyakarta": 1,
  "Jawa Timur": 1,
  Aceh: 2,
  "Sumatera Utara": 2,
  "Sumatera Barat": 2,
  Riau: 2,
  "Kepulauan Riau": 2,
  Jambi: 2,
  "Sumatera Selatan": 2,
  "Kepulauan Bangka Belitung": 2,
  Bengkulu: 2,
  Lampung: 2,
  Bali: 2,
  "Nusa Tenggara Barat": 2,
  "Kalimantan Barat": 2,
  "Kalimantan Tengah": 2,
  "Kalimantan Selatan": 2,
  "Kalimantan Timur": 2,
  "Kalimantan Utara": 2,
  "Nusa Tenggara Timur": 3,
  "Sulawesi Utara": 3,
  Gorontalo: 3,
  "Sulawesi Tengah": 3,
  "Sulawesi Barat": 3,
  "Sulawesi Selatan": 3,
  "Sulawesi Tenggara": 3,
  Maluku: 3,
  "Maluku Utara": 3,
  Papua: 3,
  "Papua Barat": 3,
  "Papua Barat Daya": 3,
  "Papua Tengah": 3,
  "Papua Pegunungan": 3,
  "Papua Selatan": 3,
};

export const provinces = Object.keys(provinceZones).sort((a, b) => a.localeCompare(b));

export type CourierService = {
  id: string;
  courier: string;
  service: string;
  color: string;
  kind: "regular" | "express" | "instant" | "cargo" | "pickup";
  description: string;
  perKg: [number, number, number];
  eta: [string, string, string];
  minWeightKg?: number;
};

export const courierServices: CourierService[] = [
  {
    id: "jne-reg",
    courier: "JNE",
    service: "REG",
    color: "#1e3a8a",
    kind: "regular",
    description: "Reguler, cocok untuk semua wilayah",
    perKg: [10_000, 24_000, 42_000],
    eta: ["2–3 hari", "3–5 hari", "5–8 hari"],
  },
  {
    id: "jne-yes",
    courier: "JNE",
    service: "YES",
    color: "#1e3a8a",
    kind: "express",
    description: "Yakin Esok Sampai",
    perKg: [19_000, 42_000, 70_000],
    eta: ["1 hari", "1–2 hari", "2–3 hari"],
  },
  {
    id: "jnt-ez",
    courier: "J&T",
    service: "EZ",
    color: "#d71920",
    kind: "regular",
    description: "Reguler, pickup cepat",
    perKg: [10_000, 23_000, 41_000],
    eta: ["2–3 hari", "3–5 hari", "4–7 hari"],
  },
  {
    id: "sicepat-best",
    courier: "SiCepat",
    service: "BEST",
    color: "#c2410c",
    kind: "express",
    description: "Besok Sampai Tujuan",
    perKg: [17_000, 39_000, 66_000],
    eta: ["1 hari", "1–2 hari", "2–4 hari"],
  },
  {
    id: "anteraja-reg",
    courier: "AnterAja",
    service: "Reguler",
    color: "#7c3aed",
    kind: "regular",
    description: "Hemat untuk paket ringan",
    perKg: [9_000, 22_000, 40_000],
    eta: ["2–4 hari", "3–6 hari", "5–9 hari"],
  },
  {
    id: "jnt-cargo",
    courier: "J&T Cargo",
    service: "Kargo",
    color: "#b91c1c",
    kind: "cargo",
    description: "Lebih hemat untuk paket ≥ 5 kg",
    perKg: [5_500, 11_000, 19_000],
    eta: ["3–5 hari", "4–7 hari", "6–12 hari"],
    minWeightKg: 5,
  },
  {
    id: "instant",
    courier: "GoSend / Grab",
    service: "Instant",
    color: "#16a34a",
    kind: "instant",
    description: `Khusus area ${store.originProvince}, sampai di hari yang sama`,
    perKg: [28_000, 0, 0],
    eta: ["1–3 jam", "-", "-"],
  },
  {
    id: "pickup",
    courier: "Ambil di Toko",
    service: "Gratis",
    color: "#ffc414",
    kind: "pickup",
    description: "Ambil langsung di workshop King Ori",
    perKg: [0, 0, 0],
    eta: ["Siap diambil H+0", "-", "-"],
  },
];

export type ShippingQuote = CourierService & {
  available: boolean;
  reason?: string;
  cost: number;
  etaLabel: string;
};

export function totalWeightKg(grams: number) {
  return Math.max(1, Math.ceil(grams / 1000));
}

export function getShippingQuotes(province: string, weightGrams: number): ShippingQuote[] {
  const zone = provinceZones[province];
  const kg = totalWeightKg(weightGrams);
  const isLocal = province === store.originProvince;

  return courierServices.map((svc) => {
    if (!zone) {
      return { ...svc, available: false, reason: "Pilih provinsi dulu", cost: 0, etaLabel: "-" };
    }
    const idx = zone - 1;
    if ((svc.kind === "instant" || svc.kind === "pickup") && !isLocal) {
      return {
        ...svc,
        available: false,
        reason: `Hanya untuk ${store.originProvince}`,
        cost: 0,
        etaLabel: "-",
      };
    }
    if (svc.minWeightKg && kg < svc.minWeightKg) {
      return {
        ...svc,
        available: false,
        reason: `Minimal ${svc.minWeightKg} kg`,
        cost: 0,
        etaLabel: svc.eta[idx],
      };
    }
    const cost = svc.kind === "instant" ? svc.perKg[0] + (kg - 1) * 4_000 : svc.perKg[idx] * kg;
    return { ...svc, available: true, cost, etaLabel: svc.eta[idx] };
  });
}

export function shippingDiscount(subtotal: number, cost: number, kind: CourierService["kind"]) {
  if (kind === "pickup" || kind === "instant" || subtotal < store.freeShippingMin) return 0;
  return Math.min(cost, store.freeShippingMaxDiscount);
}
