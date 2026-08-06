"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items displayed in the global header
const navItems = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Analytics", href: "/analytics" },
  { label: "Companies", href: "/companies" },
  { label: "Bookmarks", href: "/bookmarks" },
];

export default function Header() {
  // Reads the current URL path
  const pathname = usePathname();

  // Checks whether one navigation item matches the current page
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E0BFBF] bg-[#FBF9F7]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Website logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-[#800020]"
        >
          HireScope
        </Link>

        {/* Desktop navigation menu */}
        <nav className="hidden h-full items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-full items-center px-3 text-sm font-medium transition ${
                  isActive
                    ? "text-[#800020]"
                    : "text-gray-600 hover:text-[#800020]"
                }`}
              >
                {item.label}

                {/* Active page underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#800020]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Temporary profile button */}
        <button
          type="button"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-[#F7EDEE] hover:text-[#800020]"
        >
          <span className="material-symbols-outlined text-[26px]">
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
}