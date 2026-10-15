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
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  art: ArtKind;
  accent: string;
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
};

export const categories: Category[] = [
  { id: "aksesoris-eksterior-mobil", name: "Aksesoris Eksterior Mobil", art: "cover", blurb: "Talang air, spoiler, body" },
  { id: "aksesoris-interior-mobil", name: "Aksesoris Interior Mobil", art: "perfume", blurb: "Parfum, dashboard, jok" },
  { id: "aksesoris-sepeda-motor", name: "Aksesoris Sepeda Motor", art: "helmet", blurb: "Helm, spion, cover, holder" },
  { id: "suku-cadang-mobil", name: "Suku Cadang Mobil", art: "brake", blurb: "Rem, filter, busi mobil" },
  { id: "suku-cadang-motor", name: "Suku Cadang Motor", art: "sprocket", blurb: "Oli, rem, lampu, mesin" },
  { id: "gantungan-sarung-kunci", name: "Gantungan & Sarung Kunci Kendaraan", art: "gloves", blurb: "Gantungan, sarung remote" },
  { id: "perkakas-kelengkapan", name: "Perkakas & Kelengkapan Kendaraan", art: "sparkplug", blurb: "Kunci, dongkrak, toolkit" },
  { id: "kabel-charger-konverter", name: "Kabel, Charger, & Konverter", art: "charger", blurb: "USB, QC, konverter 12V" },
  { id: "otomotif-lainnya", name: "Otomotif Lainnya", art: "tire", blurb: "Produk otomotif lain" },
];

export const products: Product[] = [
  {
    slug: "helm-full-face-kingrider-r1",
    name: "Helm Full Face KingRider R1 Double Visor SNI",
    category: "aksesoris-sepeda-motor",
    art: "helmet",
    accent: "#ff4a1c",
    price: 489_000,
    originalPrice: 650_000,
    rating: 4.9,
    reviews: 842,
    sold: 2310,
    stock: 34,
    weight: 1800,
    brand: "KingRider",
    compatibility: "Universal – semua jenis motor",
    variantLabel: "Warna",
    variants: [
      { label: "Merah Racing", accent: "#ff4a1c" },
      { label: "Hitam Doff", accent: "#3b4252" },
      { label: "Putih Pearl", accent: "#e5e7eb" },
      { label: "Biru Nitro", accent: "#2fd3ff" },
    ],
    badges: ["SNI", "Terlaris"],
    flashSale: true,
    description:
      "Helm full face dengan shell ABS high impact, double visor (clear + smoke) dan busa dalam yang bisa dilepas-cuci. Ventilasi depan & belakang menjaga kepala tetap sejuk saat perjalanan jauh.",
    highlights: [
      "Shell ABS high impact berstandar SNI",
      "Double visor: clear + inner smoke anti silau",
      "Busa dalam removable & washable",
      "Double D-ring buckle, aman untuk touring",
    ],
    specs: [
      ["Material", "ABS High Impact"],
      ["Ukuran", "M (57-58) / L (59-60)"],
      ["Berat", "± 1.450 gram"],
      ["Sertifikasi", "SNI, DOT"],
      ["Garansi", "6 bulan (cacat produksi)"],
    ],
  },
  {
    slug: "helm-half-face-retro-classic",
    name: "Helm Half Face Retro Classic Kaca Bogo SNI",
    category: "aksesoris-sepeda-motor",
    art: "helmet",
    accent: "#c9b38a",
    price: 259_000,
    originalPrice: 320_000,
    rating: 4.8,
    reviews: 391,
    sold: 1250,
    stock: 52,
    weight: 1400,
    brand: "KingRider",
    compatibility: "Universal – cocok untuk motor klasik & matic",
    variantLabel: "Warna",
    variants: [
      { label: "Krem Vintage", accent: "#c9b38a" },
      { label: "Hijau Army", accent: "#4d5b3a" },
      { label: "Hitam Glossy", accent: "#2a2f3a" },
    ],
    badges: ["SNI"],
    description:
      "Helm half face bergaya retro dengan kaca bogo yang bisa dibuka-tutup. Ringan, nyaman dipakai harian, dan bikin tampilan motor klasikmu makin ganteng.",
    highlights: ["Kaca bogo flip-up", "Lapisan busa tebal & empuk", "Tali kulit sintetis premium"],
    specs: [
      ["Material", "ABS + Kulit sintetis"],
      ["Ukuran", "All size (58-60)"],
      ["Sertifikasi", "SNI"],
      ["Garansi", "3 bulan"],
    ],
  },
  {
    slug: "lampu-led-projector-h4-35w",
    name: "Lampu LED Projector H4 Hi/Lo 35W 6000K Super Terang",
    category: "suku-cadang-motor",
    art: "headlight",
    accent: "#2fd3ff",
    price: 175_000,
    originalPrice: 249_000,
    rating: 4.9,
    reviews: 1203,
    sold: 5400,
    stock: 120,
    weight: 300,
    brand: "Ori Lumen",
    compatibility: "Soket H4 – Vario, Beat, NMax, Aerox, Mio, dll",
    variantLabel: "Warna Cahaya",
    variants: [
      { label: "Putih 6000K", accent: "#2fd3ff" },
      { label: "Kuning 3000K", accent: "#ffc414" },
    ],
    badges: ["Plug & Play", "Terlaris"],
    flashSale: true,
    description:
      "Lampu LED projector H4 dengan cut-off rapi, tidak menyilaukan pengendara dari arah berlawanan. Pemasangan plug & play tanpa potong kabel, konsumsi daya rendah sehingga aki lebih awet.",
    highlights: [
      "Cut-off tajam, sorot jauh & fokus",
      "Plug & play, tanpa modifikasi kabel",
      "Chip LED CSP dengan heatsink aluminium",
      "Tahan getaran & cipratan air (IP67)",
    ],
    specs: [
      ["Daya", "35W Hi / 25W Lo"],
      ["Tegangan", "DC 9–32V (AC/DC)"],
      ["Soket", "H4 / HS1"],
      ["Rating air", "IP67"],
      ["Garansi", "1 tahun"],
    ],
  },
  {
    slug: "lampu-sein-led-sequential",
    name: "Lampu Sein LED Running Sequential Universal (Sepasang)",
    category: "suku-cadang-motor",
    art: "headlight",
    accent: "#ffc414",
    price: 65_000,
    originalPrice: 89_000,
    rating: 4.7,
    reviews: 286,
    sold: 1890,
    stock: 200,
    weight: 200,
    brand: "Ori Lumen",
    compatibility: "Universal motor 12V",
    badges: ["Sepasang"],
    isNew: true,
    description:
      "Lampu sein LED dengan efek running sequential ala moge. Bodi ramping, lampu terang terlihat jelas di siang hari.",
    highlights: ["Efek running sequential", "Bodi tahan air", "Termasuk baut pemasangan"],
    specs: [
      ["Tegangan", "DC 12V"],
      ["Isi", "2 pcs (kiri & kanan)"],
      ["Garansi", "3 bulan"],
    ],
  },
  {
    slug: "spion-tomok-cnc-universal",
    name: "Spion Tomok CNC Lipat Universal Anti Getar (Sepasang)",
    category: "aksesoris-sepeda-motor",
    art: "mirror",
    accent: "#a3aab6",
    price: 95_000,
    originalPrice: 135_000,
    rating: 4.8,
    reviews: 654,
    sold: 3120,
    stock: 80,
    weight: 600,
    brand: "Ori Moto",
    compatibility: "Universal – drat 10mm (Honda/Yamaha) & 8mm",
    variantLabel: "Warna",
    variants: [
      { label: "Silver", accent: "#a3aab6" },
      { label: "Hitam", accent: "#3b4252" },
      { label: "Gold", accent: "#e1b54a" },
      { label: "Merah", accent: "#ff4a1c" },
    ],
    flashSale: true,
    description:
      "Spion tomok dengan dudukan CNC aluminium yang kokoh dan bisa dilipat. Kaca cembung blue lens memberikan pandangan belakang lebih luas dan anti silau.",
    highlights: ["Tangkai CNC aluminium", "Kaca blue lens anti silau", "Bisa dilipat 180°"],
    specs: [
      ["Material", "Aluminium CNC"],
      ["Drat", "10mm + adaptor 8mm"],
      ["Isi", "Sepasang"],
    ],
  },
  {
    slug: "cover-motor-waterproof-anti-uv",
    name: "Cover Motor Waterproof Anti UV Full Body Tebal",
    category: "aksesoris-sepeda-motor",
    art: "cover",
    accent: "#4b5563",
    price: 85_000,
    originalPrice: 125_000,
    rating: 4.8,
    reviews: 412,
    sold: 2050,
    stock: 95,
    weight: 700,
    brand: "Ori Moto",
    compatibility: "Matic, bebek, sport hingga 250cc",
    variantLabel: "Ukuran",
    variants: [{ label: "M (Matic)" }, { label: "L (Bebek/Sport)" }, { label: "XL (Big Matic)" }],
    description:
      "Sarung motor bahan polyester 210D dengan lapisan silver anti UV. Melindungi cat dari panas, hujan, debu dan kotoran burung. Dilengkapi lubang kunci & tas penyimpanan.",
    highlights: ["Bahan 210D tebal & waterproof", "Lapisan silver anti UV", "Free tas penyimpanan"],
    specs: [
      ["Material", "Polyester 210D"],
      ["Fitur", "Lubang gembok, karet bawah"],
    ],
  },
  {
    slug: "oli-mesin-matic-10w30-full-synthetic",
    name: "Oli Mesin Matic Full Synthetic 10W-30 JASO MB",
    category: "suku-cadang-motor",
    art: "oil",
    accent: "#ff4a1c",
    price: 62_000,
    originalPrice: 75_000,
    rating: 4.9,
    reviews: 2210,
    sold: 9800,
    stock: 300,
    weight: 900,
    brand: "Ori Lube",
    compatibility: "Semua motor matic 110–160cc",
    variantLabel: "Isi",
    variants: [{ label: "0.8 Liter" }, { label: "1 Liter" }],
    badges: ["Original", "Terlaris"],
    flashSale: true,
    description:
      "Oli full synthetic untuk motor matic dengan perlindungan maksimal di suhu tinggi. Tarikan lebih enteng, mesin halus, dan interval ganti oli lebih panjang.",
    highlights: ["Full synthetic API SN", "JASO MB untuk kopling kering", "Mengurangi gesekan & panas mesin"],
    specs: [
      ["Viskositas", "10W-30"],
      ["Standar", "API SN, JASO MB"],
      ["Isi", "0.8L / 1L"],
    ],
  },
  {
    slug: "busi-iridium-power-tip",
    name: "Busi Iridium Power Tip – Matic & Bebek",
    category: "suku-cadang-motor",
    art: "sparkplug",
    accent: "#2fd3ff",
    price: 89_000,
    originalPrice: 110_000,
    rating: 4.9,
    reviews: 978,
    sold: 4300,
    stock: 160,
    weight: 100,
    brand: "Ori Spark",
    compatibility: "Beat, Vario, Scoopy, Mio, Fino, Supra, Jupiter",
    variantLabel: "Tipe",
    variants: [{ label: "CPR9 (Honda)" }, { label: "CR7 (Yamaha)" }, { label: "C7 (Bebek)" }],
    description:
      "Busi ujung iridium 0.6mm menghasilkan percikan api lebih fokus. Pembakaran sempurna, starter lebih mudah dan konsumsi BBM lebih irit.",
    highlights: ["Ujung iridium 0.6mm", "Pembakaran lebih sempurna", "Umur pakai hingga 3x busi biasa"],
    specs: [
      ["Elektroda", "Iridium 0.6mm"],
      ["Umur pakai", "± 30.000 km"],
    ],
  },
  {
    slug: "kampas-rem-cakram-ceramic",
    name: "Kampas Rem Cakram Depan Ceramic Pakem Anti Bunyi",
    category: "suku-cadang-motor",
    art: "brake",
    accent: "#ff4a1c",
    price: 45_000,
    originalPrice: 60_000,
    rating: 4.8,
    reviews: 1540,
    sold: 7100,
    stock: 250,
    weight: 150,
    brand: "Ori Brake",
    compatibility: "Beat, Vario, Scoopy, Genio, Spacy",
    variantLabel: "Tipe Motor",
    variants: [{ label: "Honda Beat/Scoopy" }, { label: "Honda Vario 125/150" }, { label: "Yamaha NMax/Aerox" }],
    badges: ["Original"],
    description:
      "Kampas rem berbahan ceramic compound yang pakem, minim debu dan tidak berdecit. Awet dan aman untuk piringan cakram.",
    highlights: ["Ceramic compound, pakem & halus", "Minim debu rem", "Tidak bikin piringan aus"],
    specs: [
      ["Material", "Ceramic compound"],
      ["Posisi", "Depan"],
    ],
  },
  {
    slug: "piringan-cakram-floating-220mm",
    name: "Piringan Cakram Floating 220mm CNC Racing",
    category: "suku-cadang-motor",
    art: "brake",
    accent: "#ffc414",
    price: 285_000,
    originalPrice: 350_000,
    rating: 4.7,
    reviews: 203,
    sold: 640,
    stock: 25,
    weight: 800,
    brand: "Ori Brake",
    compatibility: "Vario, PCX, ADV, NMax, Aerox (dengan breket)",
    variantLabel: "Warna Rivet",
    variants: [
      { label: "Gold", accent: "#ffc414" },
      { label: "Merah", accent: "#ff4a1c" },
      { label: "Biru", accent: "#2fd3ff" },
    ],
    isNew: true,
    description:
      "Piringan cakram model floating dengan pola lubang racing untuk pembuangan panas maksimal. Pengereman lebih stabil dan tampilan makin sporty.",
    highlights: ["Stainless steel heat treated", "Desain floating anti melengkung", "Rivet aluminium CNC"],
    specs: [
      ["Diameter", "220mm"],
      ["Material", "Stainless steel 420"],
    ],
  },
  {
    slug: "shockbreaker-tabung-330mm",
    name: "Shockbreaker Tabung Belakang 330mm Adjustable Rebound",
    category: "suku-cadang-motor",
    art: "shock",
    accent: "#ffc414",
    price: 650_000,
    originalPrice: 850_000,
    rating: 4.9,
    reviews: 318,
    sold: 920,
    stock: 18,
    weight: 2200,
    brand: "Ori Suspension",
    compatibility: "Beat, Vario, Scoopy, Mio, Fino (330mm)",
    variantLabel: "Warna Per",
    variants: [
      { label: "Kuning", accent: "#ffc414" },
      { label: "Merah", accent: "#ff4a1c" },
      { label: "Hitam", accent: "#4b5563" },
    ],
    badges: ["Premium"],
    flashSale: true,
    description:
      "Shockbreaker tabung gas dengan setelan rebound & preload. Redaman lebih empuk saat boncengan dan stabil di tikungan.",
    highlights: ["Tabung gas nitrogen", "Setelan rebound 20 klik", "Garansi bocor 1 tahun"],
    specs: [
      ["Panjang", "330mm"],
      ["Tipe", "Tabung atas, gas nitrogen"],
      ["Garansi", "1 tahun"],
    ],
  },
  {
    slug: "gear-set-rantai-428h",
    name: "Gear Set + Rantai 428H Heavy Duty Anti Molor",
    category: "suku-cadang-motor",
    art: "sprocket",
    accent: "#ffc414",
    price: 189_000,
    originalPrice: 240_000,
    rating: 4.8,
    reviews: 465,
    sold: 1780,
    stock: 60,
    weight: 1600,
    brand: "Ori Drive",
    compatibility: "Supra X 125, Jupiter Z, Vixion, CB150R, Satria FU",
    variantLabel: "Motor",
    variants: [{ label: "Supra X 125" }, { label: "Jupiter Z / Vega" }, { label: "Vixion / CB150R" }],
    description:
      "Paket gear depan, gear belakang dan rantai 428H dengan material baja karbon yang dikeraskan. Awet, tidak cepat molor dan perpindahan tenaga lebih halus.",
    highlights: ["Baja karbon heat treatment", "Rantai 428H heavy duty", "Paket lengkap siap pasang"],
    specs: [
      ["Rantai", "428H – 120L"],
      ["Isi", "Gear depan, gear belakang, rantai"],
    ],
  },
  {
    slug: "ban-tubeless-90-80-14-soft-compound",
    name: "Ban Tubeless 90/80-14 Soft Compound Grip Maksimal",
    category: "suku-cadang-motor",
    art: "tire",
    accent: "#ff4a1c",
    price: 235_000,
    originalPrice: 275_000,
    rating: 4.8,
    reviews: 532,
    sold: 2460,
    stock: 70,
    weight: 2500,
    brand: "Ori Tyre",
    compatibility: "Ring 14 – Beat, Vario, Scoopy, Mio",
    variantLabel: "Ukuran",
    variants: [{ label: "80/90-14" }, { label: "90/80-14" }, { label: "100/80-14" }],
    description:
      "Ban tubeless dengan kompon lunak untuk cengkeraman maksimal di jalan kering maupun basah. Alur tapak dirancang untuk membuang air dengan cepat.",
    highlights: ["Kompon soft grip", "Tapak anti aquaplaning", "Produksi terbaru (fresh stock)"],
    specs: [
      ["Ring", "14"],
      ["Tipe", "Tubeless"],
    ],
  },
  {
    slug: "sarung-tangan-rider-touchscreen",
    name: "Sarung Tangan Rider Full Finger Touchscreen Protector",
    category: "aksesoris-sepeda-motor",
    art: "gloves",
    accent: "#ff4a1c",
    price: 79_000,
    originalPrice: 120_000,
    rating: 4.7,
    reviews: 389,
    sold: 1650,
    stock: 110,
    weight: 200,
    brand: "KingRider",
    compatibility: "Unisex",
    variantLabel: "Ukuran",
    variants: [{ label: "M" }, { label: "L" }, { label: "XL" }],
    isNew: true,
    description:
      "Sarung tangan full finger dengan pelindung knuckle, ujung jari touchscreen dan telapak anti slip. Nyaman untuk harian maupun touring.",
    highlights: ["Ujung jari bisa sentuh layar HP", "Knuckle protector", "Bahan breathable"],
    specs: [
      ["Material", "Mesh + PU leather"],
      ["Ukuran", "M / L / XL"],
    ],
  },
  {
    slug: "holder-hp-motor-anti-getar",
    name: "Holder HP Motor Aluminium Anti Getar Lock 360°",
    category: "aksesoris-sepeda-motor",
    art: "phoneholder",
    accent: "#2fd3ff",
    price: 115_000,
    originalPrice: 165_000,
    rating: 4.8,
    reviews: 721,
    sold: 3300,
    stock: 90,
    weight: 350,
    brand: "Ori Gear",
    compatibility: "HP 4.7\" – 7\", stang 22–32mm",
    badges: ["Anti Getar"],
    description:
      "Holder HP aluminium dengan damper anti getar untuk melindungi kamera OIS ponsel. Sistem lock otomatis dan bisa diputar 360°.",
    highlights: ["Damper anti getar kamera", "Auto lock, sekali klik", "Rotasi 360°"],
    specs: [
      ["Material", "Aluminium alloy"],
      ["Ukuran HP", "4.7 – 7 inch"],
    ],
  },
  {
    slug: "charger-usb-motor-qc3-voltmeter",
    name: "Charger USB Motor Dual Port QC 3.0 + Voltmeter Waterproof",
    category: "kabel-charger-konverter",
    art: "charger",
    accent: "#2fd3ff",
    price: 69_000,
    originalPrice: 99_000,
    rating: 4.7,
    reviews: 456,
    sold: 2780,
    stock: 140,
    weight: 150,
    brand: "Ori Gear",
    compatibility: "Universal motor & mobil 12V",
    flashSale: true,
    description:
      "Charger USB dual port dengan Quick Charge 3.0 dan voltmeter digital untuk memantau kondisi aki. Dilengkapi tutup karet waterproof dan saklar on/off.",
    highlights: ["Quick Charge 3.0 + 2.4A", "Voltmeter digital", "Tutup waterproof + saklar"],
    specs: [
      ["Output", "QC3.0 18W + 5V 2.4A"],
      ["Input", "DC 12–24V"],
    ],
  },
  {
    slug: "parfum-mobil-premium-gel",
    name: "Parfum Mobil Premium Gel Long Lasting 120g",
    category: "aksesoris-interior-mobil",
    art: "perfume",
    accent: "#ff4a1c",
    price: 39_000,
    originalPrice: 55_000,
    rating: 4.8,
    reviews: 612,
    sold: 4100,
    stock: 220,
    weight: 250,
    brand: "Ori Car",
    compatibility: "Semua jenis mobil",
    variantLabel: "Aroma",
    variants: [
      { label: "Sport Musk", accent: "#ff4a1c" },
      { label: "Ocean Fresh", accent: "#2fd3ff" },
      { label: "Lemon Squash", accent: "#ffc414" },
    ],
    description:
      "Parfum mobil berbentuk gel dengan wangi tahan lama hingga 60 hari. Botol kaca premium dengan tutup kayu, mempercantik dashboard mobilmu.",
    highlights: ["Tahan hingga 60 hari", "Botol kaca + tutup kayu", "Tidak bikin pusing"],
    specs: [
      ["Isi", "120 gram"],
      ["Daya tahan", "± 60 hari"],
    ],
  },
  {
    slug: "talang-air-mobil-slim-universal",
    name: "Talang Air Mobil Slim Universal Anti Bocor",
    category: "aksesoris-eksterior-mobil",
    art: "cover",
    accent: "#3b4252",
    price: 149_000,
    originalPrice: 199_000,
    rating: 4.7,
    reviews: 214,
    sold: 860,
    stock: 40,
    weight: 800,
    brand: "Ori Car",
    compatibility: "Mobil hatchback & sedan (cutting sesuai tipe)",
    variantLabel: "Warna",
    variants: [
      { label: "Hitam Doff", accent: "#3b4252" },
      { label: "Chrome", accent: "#a3aab6" },
    ],
    badges: ["Universal"],
    isNew: true,
    description:
      "Talang air slim untuk jendela mobil. Mengurangi cipratan hujan saat kaca sedikit dibuka, bahan akrilik tebal dengan double tape 3M yang tidak merusak cat.",
    highlights: ["Bahan akrilik tebal anti pecah", "Pemasangan 3M, tanpa bor", "Desain slim tidak mengganggu kamera"],
    specs: [
      ["Material", "Akrilik + 3M tape"],
      ["Isi", "4 pcs (depan & belakang)"],
    ],
  },
  {
    slug: "kampas-rem-mobil-ceramic-depan",
    name: "Kampas Rem Mobil Ceramic Depan Pakem Anti Debu",
    category: "suku-cadang-mobil",
    art: "brake",
    accent: "#ff4a1c",
    price: 285_000,
    originalPrice: 360_000,
    rating: 4.8,
    reviews: 176,
    sold: 540,
    stock: 28,
    weight: 1200,
    brand: "Ori Brake",
    compatibility: "Avanza, Xenia, Rush, Terios, Calya, Sigra (cek tipe)",
    variantLabel: "Tipe Mobil",
    variants: [{ label: "Avanza / Xenia" }, { label: "Rush / Terios" }, { label: "Calya / Sigra" }],
    badges: ["Original"],
    description:
      "Kampas rem mobil ceramic compound, pakem di spek harian maupun tanjakan. Minim debu, tidak berdecit, dan ramah ke piringan cakram.",
    highlights: ["Ceramic compound, pakem & halus", "Minim debu rem", "Termasuk sensor aus (jika tipe mendukung)"],
    specs: [
      ["Posisi", "Depan"],
      ["Material", "Ceramic compound"],
      ["Garansi", "3 bulan"],
    ],
  },
  {
    slug: "sarung-kunci-remote-mobil-kulit",
    name: "Sarung Kunci Remote Mobil Kulit Premium",
    category: "gantungan-sarung-kunci",
    art: "gloves",
    accent: "#c9b38a",
    price: 49_000,
    originalPrice: 75_000,
    rating: 4.8,
    reviews: 328,
    sold: 1420,
    stock: 90,
    weight: 80,
    brand: "Ori Car",
    compatibility: "Remote flip-key & smart key (pilih tipe)",
    variantLabel: "Tipe",
    variants: [{ label: "Honda / Toyota Flip" }, { label: "Smart Key Toyota" }, { label: "Honda PCX/Vario Key" }],
    isNew: true,
    description:
      "Sarung kunci remote berbahan kulit sintetis tebal, melindungi tombol dari aus dan gores. Jahitan rapi, terasa mewah di tangan.",
    highlights: ["Kulit sintetis tebal", "Jahitan presisi", "Melindungi tombol dari aus"],
    specs: [
      ["Material", "PU leather"],
      ["Isi", "1 pcs"],
    ],
  },
  {
    slug: "gantungan-kunci-motor-metal-logo",
    name: "Gantungan Kunci Motor Metal Enamel Logo",
    category: "gantungan-sarung-kunci",
    art: "gloves",
    accent: "#ffc414",
    price: 29_000,
    originalPrice: 45_000,
    rating: 4.7,
    reviews: 190,
    sold: 980,
    stock: 150,
    weight: 50,
    brand: "Ori Moto",
    compatibility: "Universal motor & mobil",
    variantLabel: "Motif",
    variants: [
      { label: "King Ori", accent: "#ff4a1c" },
      { label: "Racing Flag", accent: "#ffc414" },
      { label: "Chrome Wheel", accent: "#a3aab6" },
    ],
    description:
      "Gantungan kunci metal dengan enamel penuh warna. Ring stainless, tidak mudah patah, cocok sebagai pelengkap kunci kendaraan atau oleh-oleh bengkel.",
    highlights: ["Metal enamel, tidak mudah luntur", "Ring stainless", "Ukuran genggam nyaman"],
    specs: [
      ["Material", "Zinc alloy + enamel"],
      ["Isi", "1 pcs"],
    ],
  },
  {
    slug: "kunci-roda-mobil-lipat-4-ukuran",
    name: "Kunci Roda Mobil Lipat 17-19-21-23 mm",
    category: "perkakas-kelengkapan",
    art: "sparkplug",
    accent: "#ffc414",
    price: 89_000,
    originalPrice: 125_000,
    rating: 4.8,
    reviews: 241,
    sold: 760,
    stock: 55,
    weight: 900,
    brand: "Ori Gear",
    compatibility: "Universal mur roda 17–23 mm",
    badges: ["Wajib di bagasi"],
    description:
      "Kunci roda lipat 4 ukuran dalam satu alat. Ringan dibawa di bagasi, poros baja karbon, cocok untuk ganti ban darurat.",
    highlights: ["4 ukuran: 17, 19, 21, 23 mm", "Bisa dilipat hemat tempat", "Baja karbon anti selip"],
    specs: [
      ["Ukuran", "17 / 19 / 21 / 23 mm"],
      ["Material", "Carbon steel"],
    ],
  },
  {
    slug: "semir-ban-gel-super-gloss",
    name: "Semir Ban Gel Super Gloss Tahan Air 500ml",
    category: "otomotif-lainnya",
    art: "tire",
    accent: "#3b4252",
    price: 45_000,
    originalPrice: 65_000,
    rating: 4.8,
    reviews: 402,
    sold: 1890,
    stock: 130,
    weight: 550,
    brand: "Ori Car",
    compatibility: "Ban mobil & motor",
    description:
      "Semir ban gel yang bikin sidewall hitam mengkilap tanpa lengket. Tahan air dan tidak mudah luntur saat kena hujan.",
    highlights: ["Hasil gloss, tidak lengket", "Tahan air", "Bisa untuk mobil & motor"],
    specs: [
      ["Isi", "500 ml"],
      ["Tipe", "Gel"],
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function variantAccent(product: Product, variant?: string | null) {
  return product.variants?.find((v) => v.label === variant)?.accent ?? product.accent;
}
