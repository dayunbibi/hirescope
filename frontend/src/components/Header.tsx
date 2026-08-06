"use client";

import { useState } from "react";
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

  // Controls whether the mobile navigation menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Checks whether one navigation item matches the current page
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Closes the mobile menu after a navigation link is selected
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E0BFBF] bg-[#FBF9F7]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Website logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
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

        {/* Header action buttons */}
        <div className="flex items-center gap-2">
          {/* Temporary profile button */}
          <button
            type="button"
            aria-label="Open profile"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-[#F7EDEE] hover:text-[#800020] sm:flex"
          >
            <span className="material-symbols-outlined text-[26px]">
              account_circle
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-[#F7EDEE] hover:text-[#800020] md:hidden"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#E0BFBF] bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {navItems.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#F7EDEE] text-[#800020]"
                      : "text-gray-700 hover:bg-[#FBF9F7] hover:text-[#800020]"
                  }`}
                >
                  <span>{item.label}</span>

                  {isActive && (
                    <span className="material-symbols-outlined text-[18px]">
                      check
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Mobile profile button */}
            <button
              type="button"
              className="mt-3 flex items-center gap-3 rounded-lg border-t border-[#E0BFBF] px-4 py-4 text-left text-sm font-medium text-gray-700 transition hover:bg-[#FBF9F7] hover:text-[#800020]"
            >
              <span className="material-symbols-outlined text-[22px]">
                account_circle
              </span>

              Profile
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}