import { ImageResponse } from "next/og";

export const alt =
  "Skywatch VB — Virginia Beach flood watch & community hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(180deg, #0f3a40 0%, #1c6870 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg viewBox="0 0 40 40" width="72" height="72">
            <circle cx="20" cy="20" r="20" fill="#fdf9f1" />
            <path
              d="M4 24c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0"
              stroke="#1c6870"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M4 30c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0"
              stroke="#1c6870"
              strokeOpacity="0.55"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M20 6l1.4 3.3L25 11l-3.6 1.7L20 16l-1.4-3.3L15 11l3.6-1.7L20 6z"
              fill="#d96a3d"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#fdf9f1" }}>
            Skywatch VB
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              color: "#fdf9f1",
              lineHeight: 1.15,
              maxWidth: 950,
            }}
          >
            Know your flood risk today.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#a3d3d6",
              maxWidth: 900,
            }}
          >
            Live NOAA tide data and NWS alerts, in plain language, for Virginia
            Beach neighborhoods.
          </div>
        </div>

        <svg viewBox="0 0 1200 60" width="1040" height="52">
          <path
            d="M0 30c100 20 200 20 300 0s200-20 300 0 200 20 300 0 200-20 300 0"
            stroke="#fdf9f1"
            strokeOpacity="0.35"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
