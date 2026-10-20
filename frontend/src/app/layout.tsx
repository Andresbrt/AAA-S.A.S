import type { Metadata } from "next";
import { Playfair_Display, Outfit } from 'next/font/google';
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Toaster } from "sonner";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupoaaa.com.co';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Grupo AAA S.A.S | Proyectos y Condominios Campestres en el Caribe",
    template: "%s | Grupo AAA S.A.S"
  },
  description: "Constructora y desarrolladora líder de proyectos campestres y lotes frente al mar en el Caribe Colombiano (San Bernardo del Viento, Córdoba). Blindaje notarial, escrituras individuales y financiación directa.",
  keywords: [
    "lotes en venta caribe colombiano",
    "lotes frente al mar san bernardo del viento",
    "condominio campestre cordoba",
    "inversion inmobiliaria caribe",
    "corales del viento san bernardo",
    "parcelaciones playa colombia",
    "lotes con escritura publica",
    "constructora grupo aaa"
  ],
  authors: [{ name: "Grupo AAA S.A.S" }],
  creator: "Grupo AAA S.A.S",
  publisher: "Grupo AAA S.A.S",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Grupo AAA S.A.S | Proyectos Inmobiliarios y Lotes en el Caribe",
    description: "Invierte en tu lote frente al mar Caribe con escritura individual y financiación directa. Desarrollos campestres exclusivos en Córdoba, Colombia.",
    url: siteUrl,
    siteName: "Grupo AAA S.A.S",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Grupo AAA S.A.S - Proyectos Campestres en el Caribe',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Grupo AAA S.A.S | Lotes Campestres en el Caribe",
    description: "Desarrollos exclusivos frente al mar Caribe con blindaje notarial y financiación directa.",
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased font-outfit text-gray-900 bg-gray-50 selection:bg-[var(--color-caribbean-blue)] selection:text-white flex flex-col min-h-screen">
        <GoogleAnalytics />
        {children}
        <CookieBanner />
        <FloatingWhatsApp />
        <Toaster position="top-right" richColors closeButton theme="light" />
      </body>
    </html>
  );
}
