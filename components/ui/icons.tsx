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

export function ChatIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <path
        d="M5 8a2 2 0 012-2h18a2 2 0 012 2v11a2 2 0 01-2 2H13l-6 5v-5H7a2 2 0 01-2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 12h12M10 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <rect x="5" y="7" width="22" height="20" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M5 13h22" stroke="currentColor" strokeWidth="2" />
      <path d="M11 4v6M21 4v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="19" r="1.4" fill="currentColor" />
      <circle cx="16" cy="19" r="1.4" fill="currentColor" />
      <circle cx="21" cy="19" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function HeartHandsIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <path
        d="M16 24s-8-4.8-8-10.8a4.6 4.6 0 018-3 4.6 4.6 0 018 3C24 19.2 16 24 16 24z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
