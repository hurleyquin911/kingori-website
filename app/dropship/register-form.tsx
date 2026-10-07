"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { dropship, store } from "@/lib/store-config";

type Errors = Partial<Record<"name" | "phone" | "city" | "platforms", string>>;

export function RegisterForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [shop, setShop] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  function toggle(p: string) {
    setPlatforms((list) => (list.includes(p) ? list.filter((x) => x !== p) : [...list, p]));
    setErrors((e) => ({ ...e, platforms: undefined }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors = {};
    if (name.trim().length < 3) found.name = "Isi nama lengkap";
    if (!/^(\+62|62|0)8\d{7,12}$/.test(phone.replace(/[\s-]/g, ""))) found.phone = "Nomor WhatsApp tidak valid";
    if (city.trim().length < 3) found.city = "Isi kota domisili";
    if (platforms.length === 0) found.platforms = "Pilih minimal satu tempat jualan";
    setErrors(found);
    if (Object.keys(found).length) return;

    const message = [
      `Halo admin ${store.name}, saya mau daftar jadi DROPSHIPPER.`,
      "",
      `Nama: ${name.trim()}`,
      `No. WhatsApp: ${phone.trim()}`,
      `Kota: ${city.trim()}`,
      shop.trim() ? `Nama toko: ${shop.trim()}` : "",
      `Jualan di: ${platforms.join(", ")}`,
      "",
      "Mohon info katalog & cara order dropship-nya. Terima kasih!",
    ]
      .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
      .join("\n");
    window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  }

  const err = (k: keyof Errors) =>
    errors[k] && (
      <p role="alert" className="mt-1.5 text-xs font-semibold text-red-400">
        {errors[k]}
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className="label">Nama lengkap</label>
          <input id="r-name" className="field" value={name} aria-invalid={!!errors.name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} placeholder="Nama kamu" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="r-phone" className="label">No. WhatsApp</label>
          <input id="r-phone" className="field" type="tel" inputMode="tel" value={phone} aria-invalid={!!errors.phone} onChange={(e) => { setPhone(e.target.value); setErrors((x) => ({ ...x, phone: undefined })); }} placeholder="0812 xxxx xxxx" />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="r-city" className="label">Kota domisili</label>
          <input id="r-city" className="field" value={city} aria-invalid={!!errors.city} onChange={(e) => { setCity(e.target.value); setErrors((x) => ({ ...x, city: undefined })); }} placeholder="Contoh: Bandung" />
          {err("city")}
        </div>
        <div>
          <label htmlFor="r-shop" className="label">Nama toko (opsional)</label>
          <input id="r-shop" className="field" value={shop} onChange={(e) => setShop(e.target.value)} placeholder="Garasi Budi Motor" />
        </div>
      </div>
      <div>
        <p className="label">Kamu jualan di mana?</p>
        <div className="flex flex-wrap gap-2">
          {dropship.platforms.map((p) => {
            const on = platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(p)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  on ? "border-hazard bg-hazard text-asphalt" : "border-line-2 text-steel hover:border-steel hover:text-white"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
        {err("platforms")}
      </div>
      <button type="submit" className="btn-ignite w-full bg-turbo py-4 hover:bg-[#2fe06e]">
        <Icon name="whatsapp" className="size-5" /> Daftar Dropship via WhatsApp
      </button>
      <p className="text-center text-xs text-dim">Gratis, tanpa biaya pendaftaran & tanpa minimal order.</p>
    </form>
  );
}
