import Link from "next/link";

// Navigation items displayed in the top header
const navItems = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Analytics", href: "/analytics" },
  { label: "Companies", href: "/companies" },
  { label: "Bookmarks", href: "/bookmarks" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E0BFBF] bg-[#FBF9F7]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Website logo */}
        <Link href="/" className="text-2xl font-bold text-[#800020]">
          HireScope
        </Link>

        {/* Desktop navigation menu */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition hover:text-[#800020]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Temporary profile button */}
        <button
          type="button"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0BFBF] text-[#800020] transition hover:bg-[#FFDADA]"
        >
          ◯
        </button>
      </div>
    </header>
  );
}