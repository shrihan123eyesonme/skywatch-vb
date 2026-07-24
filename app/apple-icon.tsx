import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icons get their corners rounded by iOS itself, so this renders
// the logo on a full-bleed square instead of the circular favicon treatment.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c6870",
        }}
      >
        <svg viewBox="0 0 40 40" width="140" height="140">
          <path
            d="M4 24c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0"
            stroke="#fdf9f1"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M4 30c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0"
            stroke="#fdf9f1"
            strokeOpacity="0.55"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M20 6l1.4 3.3L25 11l-3.6 1.7L20 16l-1.4-3.3L15 11l3.6-1.7L20 6z"
            fill="#f0e0bc"
          />
        </svg>
      </div>
    ),
    size
  );
}
