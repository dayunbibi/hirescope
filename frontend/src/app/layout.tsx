import type { Metadata } from "next";
import { Overpass, Overpass_Mono } from "next/font/google";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import "./globals.css";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const overpassMono = Overpass_Mono({
  variable: "--font-overpass-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HireScope",
  description:
    "Toronto developer job search and job market analytics platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${overpass.variable} ${overpassMono.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols stay until every page is migrated to inline SVG icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="flex min-h-full flex-col">
        <TopNav />
        <MobileNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
