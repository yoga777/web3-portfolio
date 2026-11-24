import { ImageResponse } from "next/og";

export const alt = "Yuga Adi Kusuma — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Isometric cube mark (same geometry as public/logo-mark.svg): a hexagon
// outline whose inner edges form a "Y" — drawn as inline SVG, which
// ImageResponse (satori) supports.
function CubeMark({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <polygon
        points="32,7 53.7,19.5 53.7,44.5 32,57 10.3,44.5 10.3,19.5"
        stroke="#3B82F6"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 32 L10.3 19.5 M32 32 L53.7 19.5 M32 32 L32 57"
        stroke="#3B82F6"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, rgba(37,99,235,0.22), transparent)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <CubeMark size={64} />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 4,
              color: "#3B82F6",
            }}
          >
            PORTOFOLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.05,
            }}
          >
            Yuga Adi Kusuma
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#a1a1aa" }}>
            Full Stack Developer — Jombang, Indonesia
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            color: "#3B82F6",
          }}
        >
          PHP · JavaScript · Python · PostgreSQL · Web3
        </div>
      </div>
    ),
    { ...size },
  );
}
