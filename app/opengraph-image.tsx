import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "King Ori — Suku Cadang Motor & Aksesoris Mobil Original";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #08090b 0%, #16181d 55%, #2a120c 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              background: "linear-gradient(135deg, #ffc414, #ff4a1c)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 2 }}>KING ORI</div>
            <div style={{ fontSize: 16, color: "#9aa3b2", letterSpacing: 3 }}>SUKU CADANG & AKSESORIS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.12, maxWidth: 1000 }}>
            Suku Cadang Motor & Aksesoris Mobil Original
          </div>
          <div style={{ fontSize: 24, color: "#c5ccd6", maxWidth: 880 }}>
            Helm, lampu LED, oli, kampas rem, charger — kirim ke seluruh Indonesia.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#ff4a1c",
            fontWeight: 700,
          }}
        >
          <span>kingori.store</span>
          <span>100% ORIGINAL</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
