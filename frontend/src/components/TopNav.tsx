"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookmarks } from "@/hooks/useBookmarks";

// Navigation items shared by the desktop and mobile navigation
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Analytics", href: "/analytics" },
  { label: "Companies", href: "/companies" },
  { label: "Bookmarks", href: "/bookmarks" },
];

// Checks whether a navigation item matches the current page
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Logo roundel: a red ring with a bar through it, plus the wordmark
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`flex items-center font-extrabold tracking-[-0.01em] ${
        compact ? "gap-2.5 text-lg" : "gap-3 text-xl"
      }`}
    >
      <span
        aria-hidden="true"
        className={`relative grid place-items-center rounded-full border-brand ${
          compact ? "size-6 border-4" : "size-7 border-[5px]"
        }`}
      >
        <span
          className={`absolute bg-brand ${
            compact ? "h-1.5 w-[30px]" : "h-[7px] w-9"
          }`}
        />
      </span>
      HireScope
    </span>
  );
}

// Desktop navigation bar
export default function TopNav() {
  const pathname = usePathname();
  const { bookmarkedJobIds, isLoaded } = useBookmarks();

  return (
    <header className="sticky top-0 z-40 hidden h-[68px] items-center justify-between bg-ink px-6 text-paper md:flex lg:px-12">
      <Link
        href="/"
        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        <Logo />
      </Link>

      <nav aria-label="Main" className="flex gap-1 text-[15px] font-semibold">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-signal ${
                isActive
                  ? "bg-paper text-ink"
                  : "text-board-soft hover:text-paper"
              }`}
            >
              {item.label}

              {item.href === "/bookmarks" &&
                isLoaded &&
                bookmarkedJobIds.length > 0 && (
                  <span className="font-mono text-[13px]">
                    {bookmarkedJobIds.length}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>

      {/* Balances the logo so the links stay centered */}
      <span aria-hidden="true" className="hidden w-[140px] lg:block" />
    </header>
  );
}
