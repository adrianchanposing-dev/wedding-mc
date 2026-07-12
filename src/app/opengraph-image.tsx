import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.brand} | 香港婚禮司儀`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #f3e6d8 0%, #e8d3ba 100%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9a6b3f",
          }}
        >
          Wedding &amp; Event Emcee · Hong Kong
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 72,
            fontWeight: 600,
            color: "#2b2420",
          }}
        >
          {site.brand}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 36,
            color: "#4a3f36",
          }}
        >
          {site.brandZh}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 26,
            color: "#6b5c4c",
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
