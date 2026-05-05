import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TravelerForge — Visor Académico",
  description: "Visor académico gamificado · Tecnología de la Representación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${inter.variable} ${ebGaramond.variable} antialiased`} style={{ background: "#0c0d11" }}>

        {/* ── Global ambient background — fixed, behind everything ── */}
        <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
          {/* Gold orb top-left */}
          <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-[#d4a017]/[0.05] blur-[120px]" />
          {/* Gold orb bottom-right */}
          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#d4a017]/[0.03] blur-[100px]" />
          {/* Center subtle pulse */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#d4a017]/[0.02] blur-[80px]" />
          {/* Fine grid */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: "linear-gradient(rgba(160,125,55,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(160,125,55,0.8) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
