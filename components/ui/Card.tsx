import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-ocean-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:bg-ocean-700/40 dark:border-ocean-600 ${className}`}
    >
      {children}
    </div>
  );
}
