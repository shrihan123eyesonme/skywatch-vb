"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";

const NAV = [
  { href: "/flood-watch", label: "Flood & Storm Watch" },
  { href: "/community", label: "Community" },
  { href: "/forum", label: "Forum" },
  { href: "/events", label: "Events" },
  { href: "/account", label: "My Account" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ocean-100 bg-sand-50/90 backdrop-blur dark:border-ocean-600 dark:bg-ocean-800/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-ocean-700 dark:text-sand-50"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-8 w-8" />
          Skywatch VB
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex sm:gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 transition-colors ${
                  active
                    ? "bg-ocean-500 text-sand-50"
                    : "text-ocean-700 hover:bg-ocean-50 dark:text-sand-100 dark:hover:bg-ocean-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ocean-700 hover:bg-ocean-50 dark:text-sand-100 dark:hover:bg-ocean-600 sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-ocean-100 px-4 py-2 dark:border-ocean-600 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-medium text-ocean-700 hover:bg-ocean-50 dark:text-sand-100 dark:hover:bg-ocean-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
