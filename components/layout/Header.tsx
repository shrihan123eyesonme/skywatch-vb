import Link from "next/link";

const NAV = [
  { href: "/flood-watch", label: "Flood & Storm Watch" },
  { href: "/aerospace", label: "Aerospace & Opportunity Hub" },
  { href: "/account", label: "My Account" },
];

export function Header() {
  return (
    <header className="border-b border-ocean-100 bg-sand-50/90 backdrop-blur dark:bg-ocean-800/90 dark:border-ocean-600 sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-ocean-700 dark:text-sand-50">
          <span aria-hidden className="text-2xl">🌊</span>
          Skywatch VB
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-ocean-700 hover:bg-ocean-50 dark:text-sand-100 dark:hover:bg-ocean-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
