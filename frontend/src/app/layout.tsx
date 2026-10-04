import type { Metadata } from "next";
import { Playfair_Display, Outfit } from 'next/font/google';
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "Grupo AAA S.A.S | Proyectos y Condominios Campestres en el Caribe",
  description: "Constructora líder en proyectos campestres en el Caribe Colombiano. Especialistas en estructuración, urbanismo, venta de lotes y construcción bioclimática.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased font-outfit text-gray-900 bg-gray-50 selection:bg-[var(--color-caribbean-blue)] selection:text-white flex flex-col min-h-screen">
        {children}
        <CookieBanner />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
