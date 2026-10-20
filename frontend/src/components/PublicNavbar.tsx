'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { buildWhatsAppUrl, COMPANY_PHONE_DISPLAY } from '@/lib/contact';
import { PiListLight, PiXLight, PiWhatsappLogoLight, PiPhoneLight } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar({ 
  variant = 'transparent-dark' 
}: { 
  variant?: 'transparent-dark' | 'transparent-light' | 'solid' 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const isLightText = !scrolled && variant === 'transparent-dark';

  const navLinks = [
    { name: 'Inicio', href: '/#inicio' },
    { name: 'Proyectos', href: '/proyectos' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Ubicación', href: '/#ubicacion' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  return (
    <>
      <header 
        className={`site-header ${
          scrolled 
            ? 'scrolled' 
            : variant === 'solid' 
              ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
              : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          {/* Brand Logo / Text */}
          <Link href="/" className="flex items-center gap-2 z-50 group">
            <span className={`text-2xl font-light tracking-widest uppercase transition-colors ${
              isLightText ? 'text-white' : 'text-[var(--color-caribbean-dark)]'
            }`}>
              Grupo <span className="font-bold text-[var(--color-gold-accent)]">AAA</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--color-gold-accent)] ${
                  isLightText ? 'text-white/90' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={buildWhatsAppUrl('Hola! Deseo comunicarme con un Asesor VIP de Grupo AAA.')} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={
                isLightText
                  ? 'btn-outline-gold !text-white !border-white/80 hover:!bg-white hover:!text-[var(--color-caribbean-dark)]'
                  : 'btn-primary-glow'
              }
            >
              Asesor VIP
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href={buildWhatsAppUrl('Hola! Deseo comunicarme con un Asesor de Grupo AAA.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className={`p-2 rounded-full border transition-colors ${
                isLightText 
                  ? 'text-white border-white/40 bg-white/10' 
                  : 'text-[var(--color-caribbean-dark)] border-gray-200 bg-white'
              }`}
            >
              <PiWhatsappLogoLight size={20} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isLightText 
                  ? 'text-white bg-white/10 border border-white/20' 
                  : 'text-[var(--color-caribbean-dark)] bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {mobileMenuOpen ? <PiXLight size={24} /> : <PiListLight size={24} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[85%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <span className="text-xl font-light tracking-widest uppercase text-[var(--color-caribbean-dark)]">
                    Grupo <span className="font-bold text-[var(--color-gold-accent)]">AAA</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Cerrar menú"
                    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <PiXLight size={22} />
                  </button>
                </div>

                {/* Navigation Links List */}
                <nav className="py-6 flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-gray-800 hover:text-[var(--color-caribbean-blue)] py-2 border-b border-gray-50 flex items-center justify-between transition-colors"
                    >
                      <span>{link.name}</span>
                      <span className="text-gray-300 text-sm">&rarr;</span>
                    </Link>
                  ))}
                  <Link
                    href="/#faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-800 hover:text-[var(--color-caribbean-blue)] py-2 border-b border-gray-50 flex items-center justify-between transition-colors"
                  >
                    <span>Preguntas Frecuentes</span>
                    <span className="text-gray-300 text-sm">&rarr;</span>
                  </Link>
                </nav>
              </div>

              {/* Drawer Bottom CTAs */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <a
                  href={buildWhatsAppUrl('Hola! Deseo agendar una cita o asesoría con Grupo AAA.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#20bd5a] transition-colors text-sm"
                >
                  <PiWhatsappLogoLight size={20} />
                  <span>Chat con Asesor VIP</span>
                </a>

                <a
                  href="tel:+573122384172"
                  className="w-full bg-gray-50 hover:bg-gray-100 text-[var(--color-caribbean-dark)] py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 border border-gray-200 transition-colors text-sm"
                >
                  <PiPhoneLight size={18} />
                  <span>Llamar: {COMPANY_PHONE_DISPLAY}</span>
                </a>

                <div className="pt-3 text-center">
                  <Link 
                    href="/portal-asesores"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Portal Asesores / CRM
                  </Link>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
