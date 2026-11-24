import { ImageResponse } from "next/og";

export function renderPwaIcon(size: number) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#03060c" }}>
      <div style={{ width: size * .72, height: size * .72, display: "flex", alignItems: "center", justifyContent: "center", border: `${Math.max(2, Math.round(size * .012))}px solid #3b82f6`, borderRadius: size * .17, backgroundColor: "#0b182c" }}>
        <span style={{ color: "#ffffff", fontFamily: "sans-serif", fontSize: size * .43, fontWeight: 800, letterSpacing: -size * .035 }}>p.</span>
      </div>
    </div>,
    { width: size, height: size },
  );
}
