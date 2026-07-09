export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="20" fill="var(--color-ocean-500)" />
      <path
        d="M4 24c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0"
        stroke="var(--color-sand-50)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M4 30c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0"
        stroke="var(--color-sand-50)"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 6l1.4 3.3L25 11l-3.6 1.7L20 16l-1.4-3.3L15 11l3.6-1.7L20 6z"
        fill="var(--color-sand-200)"
      />
    </svg>
  );
}
