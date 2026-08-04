import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Support", href: "#" },
];

// Displays the global website footer
export default function Footer() {
  return (
    <footer className="border-t border-[#E0BFBF] bg-[#F5F0EE] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Footer logo */}
        <p className="text-lg font-bold text-[#800020]">HireScope</p>

        {/* Footer navigation links */}
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-gray-600 transition hover:text-[#800020]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright text */}
        <p className="text-sm text-gray-500">
          © 2026 HireScope Toronto
        </p>
      </div>
    </footer>
  );
}