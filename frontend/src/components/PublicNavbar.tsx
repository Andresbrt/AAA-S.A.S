'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {/* Si no hay logo, mostramos texto premium */}
          <span className={`text-2xl font-light tracking-widest uppercase ${scrolled ? 'text-[var(--color-caribbean-dark)]' : 'text-white'}`}>
            Grupo <span className="font-bold">AAA</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link href="/#inicio" className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--color-gold-accent)] ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
            Inicio
          </Link>
          <Link href="/#proyectos" className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--color-gold-accent)] ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
            Proyectos
          </Link>
          <Link href="/#mapa-interactivo" className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--color-gold-accent)] ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
            Lotes 3D
          </Link>
          <Link href="/#servicios" className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--color-gold-accent)] ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
            Servicios
          </Link>
          <Link href="/#nosotros" className={`text-sm font-bold tracking-wide transition-colors hover:text-[var(--color-gold-accent)] ${scrolled ? 'text-[var(--color-caribbean-blue)]' : 'text-white'}`}>
            Nosotros
          </Link>
        </nav>

        <Link href="/#contacto" className={scrolled ? 'btn-primary-glow' : 'btn-outline-gold !text-white !border-white hover:!bg-white hover:!text-[var(--color-caribbean-dark)]'}>
          Asesor VIP
        </Link>
      </div>
    </header>
  );
}
