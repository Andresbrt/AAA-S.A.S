"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { buildWhatsAppUrl } from '@/lib/contact';

interface HeroContentProps {
  company?: {
    name?: string;
    heroTitle?: string;
    heroSubtitle?: string;
  };
}

export default function HeroContent({ company }: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20"
    >
      <h2 className="text-[var(--color-gold-accent)] text-xs md:text-sm lg:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-6 font-bold drop-shadow-lg bg-black/30 inline-block px-4 md:px-6 py-2 rounded-full backdrop-blur-md border border-[var(--color-gold-accent)]/40 shadow-sm">
        {company?.name || 'GRUPO AAA S.A.S.'}
      </h2>
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 md:mb-8 tracking-tight drop-shadow-2xl leading-[1.08] font-sans whitespace-pre-line">
        {company?.heroTitle || 'Vive el lujo en\ntu lugar ideal'}
      </h1>
      <p className="text-white/95 text-base md:text-lg lg:text-xl font-medium mb-10 md:mb-12 max-w-2xl mx-auto drop-shadow-lg px-2 leading-relaxed">
        {company?.heroSubtitle || 'Descubre nuestros condominios y proyectos costeros diseñados para un estilo de vida excepcional.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link 
          href="#proyectos" 
          aria-label="Ver portafolio de proyectos disponibles"
          className="bg-[var(--color-gold-accent)] text-white hover:bg-[#0369A1] font-bold text-sm px-8 py-4 rounded-full transition shadow-[0_0_20px_rgba(2,132,199,0.4)] focus:outline-none focus:ring-4 focus:ring-sky-300"
        >
          VER PORTAFOLIO
        </Link>

        <a 
          href={buildWhatsAppUrl('Hola! Me gustaría agendar una asesoría personalizada con Grupo AAA.')} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Contactar a un asesor comercial VIP por WhatsApp"
          className="bg-white/10 backdrop-blur-md text-white border border-white/60 hover:bg-white hover:text-[var(--color-caribbean-dark)] font-bold text-sm px-8 py-4 rounded-full transition focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          ASESORÍA PERSONAL
        </a>
      </div>

      {/* Trust Highlights con accesibilidad semántica */}
      <div 
        role="region" 
        aria-label="Garantías y trayectoria"
        className="pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-white/90 text-xs md:text-sm font-medium"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-[var(--color-gold-accent)] font-bold text-base" aria-hidden="true">✦</span>
          <span>+5 Años de Trayectoria</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-[var(--color-gold-accent)] font-bold text-base" aria-hidden="true">✦</span>
          <span>100% Blindaje Notarial</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-[var(--color-gold-accent)] font-bold text-base" aria-hidden="true">✦</span>
          <span>A 5 min del Mar Caribe</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-[var(--color-gold-accent)] font-bold text-base" aria-hidden="true">✦</span>
          <span>Financiación Directa</span>
        </div>
      </div>
    </motion.div>
  );
}
