export function WaveIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <path
        d="M2 20c2.5-2 4-2 6.5 0s4 2 6.5 0 4-2 6.5 0 4 2 6.5 0"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M2 25c2.5-2 4-2 6.5 0s4 2 6.5 0 4-2 6.5 0 4 2 6.5 0"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M8 15c0-4.5 3-8 8-8s8 3.5 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 4"
      />
    </svg>
  );
}

export function CompassIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20.5 11.5l-3 6-6 3 3-6 6-3z"
        fill="currentColor"
      />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3z" strokeLinejoin="round" />
      <path d="M10 21a2 2 0 004 0" strokeLinecap="round" />
    </svg>
  );
}
