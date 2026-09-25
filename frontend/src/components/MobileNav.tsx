"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Logo, isActivePath, navItems } from "@/components/TopNav";

// Mobile navigation: a bar with a full-screen menu drawn as a line with stations
export default function MobileNav() {
  const pathname = usePathname();
  const { bookmarkedJobIds, isLoaded } = useBookmarks();
  const [isOpen, setIsOpen] = useState(false);

  // Closes the menu with the Escape key
  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between bg-ink pl-5 pr-3 text-paper md:hidden">
      <Link href="/" onClick={() => setIsOpen(false)}>
        <Logo compact />
      </Link>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="flex size-11 flex-col items-center justify-center gap-[5px] rounded-full focus-visible:outline-2 focus-visible:outline-signal"
      >
        <span className="h-0.5 w-5 bg-paper" />
        <span className="h-0.5 w-5 bg-paper" />
        <span className="h-0.5 w-5 bg-paper" />
      </button>

      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper"
        >
          <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-board-divider-2 pl-5 pr-3">
            <Logo compact />

            <button
              type="button"
              autoFocus
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full bg-board-divider-2 text-xl font-bold focus-visible:outline-2 focus-visible:outline-signal"
            >
              ×
            </button>
          </div>

          <nav aria-label="Main" className="relative flex flex-col px-5 pt-6">
            {/* The line connecting every station */}
            <span
              aria-hidden="true"
              className="absolute bottom-[30px] left-[33px] top-12 w-1.5 rounded-full bg-brand"
            />

            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex h-16 items-center gap-[18px] text-[22px] focus-visible:outline-2 focus-visible:outline-signal ${
                    isActive
                      ? "font-extrabold text-white"
                      : "font-bold text-board-soft"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-8 shrink-0 rounded-full border-[5px] ${
                      isActive
                        ? "border-paper bg-paper shadow-[0_0_0_5px_rgba(245,244,239,0.2)]"
                        : "border-brand bg-ink"
                    }`}
                  />
                  {item.label}

                  {isActive ? (
                    <span className="ml-auto font-mono text-xs font-semibold text-signal">
                      YOU ARE HERE
                    </span>
                  ) : (
                    item.href === "/bookmarks" &&
                    isLoaded &&
                    bookmarkedJobIds.length > 0 && (
                      <span className="ml-auto font-mono text-[13px] font-semibold">
                        {bookmarkedJobIds.length}
                      </span>
                    )
                  )}
                </Link>
              );
            })}
          </nav>

          <p className="mt-auto border-t border-board-divider-2 p-5 font-mono text-xs leading-relaxed text-board-muted">
            Sources: Greenhouse, Lever, RemoteOK, Jobicy
          </p>
        </div>
      )}
    </header>
  );
}
