import { ImageResponse } from "next/og";
import { ogImageTagline, siteName } from "@/lib/site";

export const runtime = "edge";

export const alt = `${siteName} — Decision Intelligence`;

export const size = {
  width: 1200,
  height: 630,
};

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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0f172a 0%, #000000 45%, #1e1b4b 100%)",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            marginBottom: 16,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#a5b4fc",
            textAlign: "center",
            maxWidth: 880,
            lineHeight: 1.35,
          }}
        >
          {ogImageTagline}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 14,
            fontWeight: 700,
            color: "#6366f1",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          Decision Intelligence
        </div>
      </div>
    ),
    { ...size }
  );
}
